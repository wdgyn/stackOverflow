import { ObjectId } from "mongodb";
import { initDBIfNecessary } from "./utils.js";
import { getUserById } from "./usersDb.js";




export async function getAllQuestions() {
    const db = await initDBIfNecessary();
    try {
        return db.collection("questions").find().toArray();
    } catch(error) {
        console.error("(questionsDb.js)Error fetching all questions:", error);
        throw error;
    }
}

export async function getQuestionById(questionId) {
    const db = await initDBIfNecessary();
    try {
        return db.collection("questions").findOne({ _id: ObjectId.createFromHexString(questionId)});
    } catch(error) {
        console.error("(questionsDb.js)Error fetching question:", error);
        throw error;
    }
}

export async function incrementViewCountQuestion(questionId) {
    const db = await initDBIfNecessary();
  
    try {
      await db.collection("questions").updateOne(
        { _id: ObjectId.createFromHexString(questionId) },
        { $inc: { views: 1 } }
      );
    } catch (error) {
      console.error("(questionsDb.js) Error incrementing view count:", error);
      throw error;
    }
}


export async function getQuestionsByUser(userId) {
    try {
        const db = await initDBIfNecessary();

        // Find user by userId to get the correct username
        const user = await getUserById(userId);
        if (!user) {
            console.error("User not found for this ID:", userId);
            throw error;
        }
        const username = user.username; // Extract username
        // console.log("(questionDb.js)Found User's Username:", username); //debug

        return db.collection("questions").find({ createdBy: username }).toArray();
    } catch (error) {
        console.error("(questionDb.js)Error retrieving all questions by specific user:", error);
        throw error;
    }
}


export async function insertQuestion(questionData, userId) {
    const db = await initDBIfNecessary();
    const user = await getUserById(userId);

    // Convert tags from string to array
    const tagArray = questionData.tags.split(",").map(tag => tag.trim());

    const question = {
        title: questionData.title,
        body: questionData.body,
        tags: tagArray,
        createdBy : user.username,
        timeStamp: new Date(),
        views: 0,
        voteCount: 0,
        votes: [],
    };
    try {
        return db.collection("questions").insertOne(question);
    } catch (error) {
        console.error("(questionDb.js)Error inserting question:", error);
        throw error;
    }


    //OR
    /*
    await initDBIfNecessary();
    // console.log("userId:", userId); //debug

    const user = await getUserById(userId);

    const { title, body, tags } = questionData;
    const createdBy = user.username; // User who posted the question
    const timeStamp = new Date(); // Capture the current timestamp
    const voteNumber = 0; // Default vote count
    const views = 0; // Default view count
    const answers = []; // Empty array for answers

    // Convert tags from string to array
    const tagArray = tags.split(",").map(tag => tag.trim());

    // Construct the full question object
    const newQuestion = {
        title,
        body,
        tags: tagArray,
        timeStamp,
        voteNumber,
        views,
        createdBy,
        answers
    };

    try {
        await db.collection("questions").insertOne(question);
        // console.log("Question Saved:", newQuestion); //debug
    } catch (error) {
        throw new Error("Error saving question:", error);
    }
    */
}


export async function updateQuestion(questionData, questionId, username) {
    const db = await initDBIfNecessary();
    
    const updateFields = {};
    if (questionData.title) {
        updateFields.title = questionData.title;
    }
    if (questionData.body) {
        updateFields.body = questionData.body;
    }
    if (questionData.tags) {
        const tagArray = questionData.tags.split(",").map(tag => tag.trim());  
        updateFields.tags = tagArray;
    }
    
    await db.collection("questions").updateOne(
    //   {_id: ObjectId.createFromHexString(questionId)}, //line a
      {_id: ObjectId.createFromHexString(questionId), createdBy: username}, // apparently, this is more safe than line a, as it is another layer of check to ensure that the username passed in matches the answer's username in the database(ie. answer.createdBy attribute)
      {$set: updateFields}
    );
}


export async function deleteQuestion(questionId, username) {
    const db = await initDBIfNecessary();
    try {
        // return db.collection("questions").deleteOne({ _id: ObjectId.createFromHexString(questionId)}); //line x
        return db.collection("questions").deleteOne({ _id: ObjectId.createFromHexString(questionId), createdBy: username}); //apparently, this is more safe than line x, as it is another layer of check to ensure that the username passed in matches the answer's username in the database(ie. answer.createdBy attribute)
    } catch(error) {
        console.error("(questionsDb.js)Error deleting question:", error);
        throw error;
    }
}

export async function getAllQuestionTags() {
    const db = await initDBIfNecessary();

    try {
        // Use aggregation to flatten and group all tags
        const result = await db.collection("questions").aggregate([
            { $unwind: "$tags" },                     // Flatten all tag arrays
            { $group: { _id: null, tags: { $addToSet: "$tags" } } }, // Collect unique tags
            { $project: { _id: 0, tags: 1 } }         // Return only tags
        ]).toArray();

        // console.log(result); //debug

        return result.length > 0 ? result[0].tags : [];
    } catch (error) {
        console.error("(questionsDb.js)Error fetching all question tags:", error);
        throw error;
    }
}


export async function getQuestionsBySelectedTags(tagsArray) {
    const db = await initDBIfNecessary();
  
    // Use MongoDB $in to match any tag in the array
    const result = await db.collection("questions").find({
      tags: { $in: tagsArray }
    }).toArray();
  
    return result;
}







export async function upvoteQuestion(questionId, username) {
    const db = await initDBIfNecessary();
    const question = await db.collection("questions").findOne({ _id: ObjectId.createFromHexString(questionId) });
  
    if (!question) throw new Error("Question not found");

    const existingVote = (question.votes || []).find(v => v.username === username);
    let updatedVotes = [...(question.votes || [])];
    let voteCount = question.voteCount || 0;
  
    if (existingVote?.voteType === "upvote") {
      // Toggle off
      updatedVotes = updatedVotes.filter(v => v.username !== username);
      voteCount -= 1;
    } else if (existingVote?.voteType === "downvote") {
      // Switch from downvote to upvote
      updatedVotes = updatedVotes.map(v =>
        v.username === username ? { username, voteType: "upvote" } : v
      );
      voteCount += 2;
    } else {
      // New upvote
      updatedVotes.push({ username, voteType: "upvote" });
      voteCount += 1;
    }
  
    await db.collection("questions").updateOne(
      { _id: question._id },
      { $set: { votes: updatedVotes, voteCount } }
    );
}
  

export async function downvoteQuestion(questionId, username) {
    const db = await initDBIfNecessary();
    const question = await db.collection("questions").findOne({ _id: ObjectId.createFromHexString(questionId) });
  
    if (!question) throw new Error("Question not found");
  
    const existingVote = (question.votes || []).find(v => v.username === username);
    let updatedVotes = [...(question.votes || [])];
    let voteCount = question.voteCount || 0;
  
    if (existingVote?.voteType === "downvote") {
      // Toggle off
      updatedVotes = updatedVotes.filter(v => v.username !== username);
      voteCount += 1;
    } else if (existingVote?.voteType === "upvote") {
      // Switch from upvote to downvote
      updatedVotes = updatedVotes.map(v =>
        v.username === username ? { username, voteType: "downvote" } : v
      );
      voteCount -= 2;
    } else {
      // New downvote
      updatedVotes.push({ username, voteType: "downvote" });
      voteCount -= 1;
    }
  
    await db.collection("questions").updateOne(
      { _id: question._id },
      { $set: { votes: updatedVotes, voteCount } }
    );
}
  