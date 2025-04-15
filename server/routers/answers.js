import express from "express";

import { 
    addAnswer,
    getAllAnswers,
    updateAnswer,
    deleteAnswer,
    getAnswerById,
    upvoteAnswer,
    downvoteAnswer,
} from "../database/answersDb.js";

const router = express.Router();

//PATCH /api/answers/:answerId - Edit/Update a answer
router.patch("/:answerId", async(req,res) => {
    const answerId = req.params.answerId;
    const answerData = req.body;
    const username = req.user.username;

    const answer = await getAnswerById(answerId);

    if (username !== answer.createdBy) {
        console.error("(answers.js) Only the user of this answer can edit this answer.");
        return res.status(401).json({error: "Only the user of this answer can edit this answer."});
    }

    try {
        await updateAnswer(answerId, answerData, username);
        res.status(200).json({message: "Answer successfully updated."});
    } catch (error) {
        console.error("(answers.js) Error updating answer:", error);
        res.status(500).json({error: "Failed to update answer."});
    }
});


//DELETE /api/answers/:answerId - Delete a answer
router.delete("/:answerId", async(req,res) => {
    const answerId = req.params.answerId;
    const username = req.user.username;

    const answer = await getAnswerById(answerId);

    if (username !== answer.createdBy) {
        console.error("(answers.js) Only the user of this answer can delete this answer.");
        return res.status(401).json({error: "Only the user of this answer can delete this answer."});
    }

    try {
        await deleteAnswer(answerId, username);
        res.status(200).json({message: "Answer successfully deleted."});
    } catch (error) {
        console.error("(answers.js) Error deleting answer:", error);
        res.status(500).json({error: "Failed to delete answer."});
    }
});



//PATCH /api/answers/:answerId/upvote - Execute upvote answer
router.patch("/:answerId/upvote", async (req, res) => {
    try {
      await upvoteAnswer(req.params.answerId, req.user.username);
      res.status(200).json({ message: "Upvote answer function successfully executed." });
    } catch (err) {
      console.error("Upvote error:", err);
      res.status(500).json({ error: "(answers.js)Failed executing upvote answer function." });
    }
});

//PATCH /api/answers/:answerId/downvote - Execute downvote answer
router.patch("/:answerId/downvote", async (req, res) => {
    try {
      await downvoteAnswer(req.params.answerId, req.user.username);
      res.status(200).json({ message: "Downvote answer function successfully executed." });
    } catch (err) {
      console.error("Downvote error:", err);
      res.status(500).json({ error: "(answers.js)Failed executing downvote answer function." });
    }
});



export default router;