import express from "express";

import { 
    insertQuestion,
    updateQuestion,
    getAllQuestions,
    getQuestionById,
    deleteQuestion,
    getQuestionsByUser,
    upvoteQuestion,
    downvoteQuestion,
    getAllQuestionTags,
    getQuestionsBySelectedTags,
    incrementViewCountQuestion,
} from "../database/questionsDb.js";

import { 
    getAllAnswers,
    addAnswer,
} from "../database/answersDb.js";

import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();



// GET /api/questions/tags - Get all unique tags of all questions
router.get("/tags", async (req, res) => {
    try {
      const tags = await getAllQuestionTags();
      res.status(200).json({ tags });
    } catch (error) {
      console.error("(questions.js)Error fetching question tags:", error);
      res.status(500).json({ error: "(questions.js)Failed to retrieve question tags." });
    }
});


// GET /api/questions/filter?tags=tag1,tag2,... - Get questions of selected tags
router.get("/filter", async (req, res) => {
    try {
      const tagQuery = req.query.tags; // tags=react,javascript
  
      if (!tagQuery) {
        return res.status(400).json({ error: "Missing tags query parameter." });
      }
  
      // Split and clean tag values
      const tagsArray = tagQuery.split(",").map(tag => tag.trim());
  
      const questions = await getQuestionsBySelectedTags(tagsArray);
      res.status(200).json(questions);
    } catch (error) {
      console.error("Error fetching questions by tags:", error);
      res.status(500).json({ error: "Failed to retrieve questions by tags." });
    }
});


//GET /api/questions/:userId/getQuestions - Get/View all questions by user 
router.get("/:userId/getQuestions", requireAuth, async(req,res) => {
    const userId = req.params.userId;

    try {
        const result = await getQuestionsByUser(userId);
        res.status(200).json(result); //debug (res.json is for postman terminal)
        // console.log(result); //debug (console.log is for VSCode terminal)
        // res.status(200).json({message: "All Questions by specific user has been succesfully retrieved."}); //for poastman use only
    } catch (error) {
        console.error("(questions.js) Failed getting all questions by specific user:", error);
        res.status(500).json({error: "Failed to retrieve all questions by specific user."});
    }
});



//POST /api/questions/:questionId/answers - Post an answer to a question
router.post("/:questionId/answer", requireAuth, async(req, res) => {
    const questionId = req.params.questionId;
    const answerData = req.body;
    const username = req.user.username;

    try {
        await addAnswer(questionId, answerData, username);
        res.status(200).json({message: "Answer successfully posted."});
    } catch (error) {
        console.error("(questions.js) Error posting answer:", error);
        res.status(500).json({error: "Failed to post answer."});
    }
});


//GET /api/questions/:questionId/answers - Get/View all answers to a question
router.get("/:questionId/answers", async(req, res) => {
    const questionId = req.params.questionId;
    try{
        const result = await getAllAnswers(questionId);
        res.status(200).json({result}); //debug
        // res.status(200).json({message: "Answers for question successfully retrieved."});
    } catch (error) {
        console.error("(questions.js) Error getting answers for question:", error);
        res.status(500).json({error: "Failed to get answers for question."});
    }
});


//PATCH /api/questions/:questionId/upvote - Execute upvote question
router.patch("/:questionId/upvote", requireAuth, async (req, res) => {
    try {
      await upvoteQuestion(req.params.questionId, req.user.username);
      res.status(200).json({ message: "Upvote question function successfully executed." });
    } catch (err) {
      console.error("Upvote error:", err);
      res.status(500).json({ error: "(questions.js)Failed executing upvote question function." });
    }
});

//PATCH /api/questions/:questionId/downvote - Execute downvote question
router.patch("/:questionId/downvote", requireAuth, async (req, res) => {
    try {
      await downvoteQuestion(req.params.questionId, req.user.username);
      res.status(200).json({ message: "Downvote question function successfully executed." });
    } catch (err) {
      console.error("Downvote error:", err);
      res.status(500).json({ error: "(questions.js)Failed executing downvote question function." });
    }
});

//PATCH /api/questions/:questionId/views - Update view count of question
router.patch("/:questionId/views", async (req, res) => {
    try {
      await incrementViewCountQuestion(req.params.questionId);
      res.status(200).json({ message: "View count updated." });
    } catch (error) {
      console.error("Failed to increment view count:", error);
      res.status(500).json({ error: "(questions.js)View count update failed." });
    }
});


//GET /api/questions/:questionId - Get/View a specific question 
router.get("/:questionId", async(req,res) => {
    const questionId = req.params.questionId;

    try {
        const result = await getQuestionById(questionId);
        res.status(200).json(result); //debug (res.json is for postman terminal)
        // console.log(result); //debug (console.log is for VSCode terminal)
        // res.status(200).json({message: "Question has been succesfully retrieved."});
    } catch (error) {
        console.error("(questions.js) Failed getting question:", error);
        res.status(500).json({error: "Failed to retrieve the question."});
    }
});


//PATCH /api/questions/:questionId - Edit question 
router.patch("/:questionId", requireAuth, async(req, res) => {
    console.log("(question.js) Data sent in from frontend", req.body); //debug
    const questionId = req.params.questionId;
    const questionData = req.body;
    const username = req.user.username;
    
    const question = await getQuestionById(questionId);

    if (username !== question.createdBy) {
        console.error("(questions.js) Only the user of this question can edit this question.");
        return res.status(401).json({error: "Only the user of this question can edit this question."});
    }

    try {
        await updateQuestion(questionData, questionId, username);
        res.status(200).json({message: "Question has been succesfully updated."});
    } catch (error) {
        console.error("(questions.js) Update question error:", error);
        res.status(500).json({error: "Failed to update question."});
    }

});


//DELETE /api/questions/:questionId - Delete a question 
router.delete("/:questionId", requireAuth, async(req,res) => {
    const questionId = req.params.questionId;
    const username = req.user.username;

    const question = await getQuestionById(questionId);

    if (username !== question.createdBy) {
        console.error("(questions.js) Only the user of this question can delete this question.");
        return res.status(401).json({error: "Only the user of this question can delete this question."});
    }

    try {
        await deleteQuestion(questionId, username);
        res.status(200).json({message: "Question has been succesfully deleted."});
    } catch (error) {
        console.error("(questions.js) Failed in deleting question:", error);
        res.status(500).json({error: "Failed to delete the question."});
    }
});


//GET /api/questions/ - Get/View all questions 
router.get("/", async(req,res) => {
    try {
        const questions = await getAllQuestions();
        res.json(questions); //debug (res.json is for postman terminal AND to send the data in json format to somewhere like frontend.)
        // console.log("(questions.js) questions:", questions); //debug (console.log is for VSCode terminal)
        // res.status(200).json({message: "All questions has been succesfully retrieved."});
    } catch (error) {
        console.error("(questions.js) Failed getting all questions:", error);
        res.status(500).json({error: "Failed to get all questions."});
    }
});


//POST /api/questions/postQuestion - Post question
router.post("/", requireAuth, async (req,res) => {
    const questionData = req.body;
    const userId = req.user.userId;

    try {
        const result = await insertQuestion(questionData, userId);
        res.status(201).json(result);
        // res.status(201).json({message: "Question successfully posted."}); //debug
    } catch (error) {
        console.error("(questions.js) Posting of qn error:", error);
        res.status(500).json({error: "Failed to post qn."});
    }
});






export default router;
