import { ObjectId } from "mongodb";
import { initDBIfNecessary } from "./utils.js";


// This is adding answer to that particular question
export async function addAnswer(questionId, answerData, username) {
    const db = await initDBIfNecessary();

    const answer = {
        "questionId": questionId,
        "body": answerData.body,
        "createdBy": username,
        "timeStamp": new Date(),
        "voteCount": 0,
        "votes": [],
    };
    try {
        return db.collection("answers").insertOne(answer);
    } catch (error) {
        console.error("(answersDb.js)Error adding answer:", error);
        throw error;
    }
}


// This is getting answers to that particular question
export async function getAllAnswers(questionId) {
    const db = await initDBIfNecessary();
    try {
        return db.collection("answers").find({ questionId: questionId }).toArray();
        // return db.collection("answers").find({ questionId: ObjectId.createFromHexString(questionId)}).toArray(); //this doesn't work, but it doesn't flag as an error in either the VSCode terminal nor the postman terminal. (When have time, try to ask ChatGPT how to rectify?)
    } catch(error) {
        console.error("(answersDb.js)Error fetching answers for question:", error);
        throw error;
    }
}


export async function updateAnswer(answerId, answerData, username) {
    const db = await initDBIfNecessary();
    
    const updateFields = {};
    if (answerData.body) {
        updateFields.body = answerData.body;
    }

    try {
        await db.collection("answers").updateOne(
            {_id: ObjectId.createFromHexString(answerId)}, //line a
            // {_id: ObjectId.createFromHexString(answerId), createdBy: username}, // apparently, this is more safe than line a, as it is another layer of check to ensure that the username passed in matches the answer's username in the database(ie. answer.createdBy attribute)
            {$set: updateFields}
          );
    } catch (error) {
        console.error("(answersDb.js)Error updating answer:", error);
        throw error;
    }
}


export async function deleteAnswer(answerId, username) {
    const db = await initDBIfNecessary();
    try {
        // return db.collection("answers").deleteOne({ _id: ObjectId.createFromHexString(answerId)});//line x
        return db.collection("answers").deleteOne({ _id: ObjectId.createFromHexString(answerId), createdBy: username}); //apparently, this is more safe than line x, as it is another layer of check to ensure that the username passed in matches the answer's username in the database(ie. answer.createdBy attribute)
    } catch(error) {
        console.error("(answersDb.js)Error deleting answer:", error);
        throw error;
    }
}


export async function getAnswerById(answerId) {
    const db = await initDBIfNecessary();
    try {
        return db.collection("answers").findOne({ _id: ObjectId.createFromHexString(answerId)});
    } catch(error) {
        console.error("(answersDb.js)Error fetching answers for question:", error);
        throw error;
    }

}


export async function upvoteAnswer(answerId, username) {
    const db = await initDBIfNecessary();
    const answer = await db.collection("answers").findOne({ _id: ObjectId.createFromHexString(answerId) });
  
    if (!answer) throw new Error("Answer not found");
  
    const existingVote = (answer.votes || []).find(v => v.username === username);
    let updatedVotes = [...(answer.votes || [])];
    let voteCount = answer.voteCount || 0;
  
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
  
    await db.collection("answers").updateOne(
      { _id: answer._id },
      { $set: { votes: updatedVotes, voteCount } }
    );
}
  

export async function downvoteAnswer(answerId, username) {
    const db = await initDBIfNecessary();
    const answer = await db.collection("answers").findOne({ _id: ObjectId.createFromHexString(answerId) });
  
    if (!answer) throw new Error("Answer not found");
  
    const existingVote = (answer.votes || []).find(v => v.username === username);
    let updatedVotes = [...(answer.votes || [])];
    let voteCount = answer.voteCount || 0;
  
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
  
    await db.collection("answers").updateOne(
      { _id: answer._id },
      { $set: { votes: updatedVotes, voteCount } }
    );
}
  
