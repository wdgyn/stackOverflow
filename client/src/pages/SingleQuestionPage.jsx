import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Divider,
    Stack
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Api from "../services/api";

function SingleQuestionPage() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    const navigate = useNavigate();

    const { questionId } = useParams();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState("");
    const [editingAnswerId, setEditingAnswerId] = useState(null);
    const [editedAnswerBody, setEditedAnswerBody] = useState("");
    const [editingQuestion, setEditingQuestion] = useState(false);
    const [editedQuestionBody, setEditedQuestionBody] = useState("");
    const [editedQuestionTitle, setEditedQuestionTitle] = useState("");
    const [editedQuestionTags, setEditedQuestionTags] = useState("");


    const viewCounted = useRef(false);
    useEffect(() => {
        Api.fetchSingleQuestion(questionId)
            .then((res) => res.json())
            .then((data) => {
                setQuestion(data);
                if (!viewCounted.current) {
                    Api.incrementViewCount(questionId);
                    viewCounted.current = true;
                }
            });

        Api.fetchAnswersByQuestionId(questionId)
            .then((res) => res.json())
            .then((data) => setAnswers(data.result));
    }, [questionId]);



    const handleQuestionVote = (type) => {
        if (!token) {
            alert("Only logged in users can vote on questions.");
            return;
        }

        const action = type === "up" ? Api.upvoteQuestion : Api.downvoteQuestion;
        action(questionId, token).then(() => {
            Api.fetchSingleQuestion(questionId)
                .then(res => res.json())
                .then(data => setQuestion(data));
        });
    };

    const handleAnswerVote = (answerId, type) => {
        if (!token) {
            alert("Only logged in users can vote on answers.");
            return;
        }

        const action = type === "up" ? Api.upvoteAnswer : Api.downvoteAnswer;
        action(answerId, token)
            .then(() => Api.fetchAnswersByQuestionId(questionId))
            .then(res => res.json())
            .then(data => setAnswers(data.result))
            .catch(err => console.error("Voting answer failed:", err));
    };


    const handleDeleteQuestion = () => {
        Api.deleteQuestion(questionId, token).then(() => navigate("/questions"));
    };

    const handlePostAnswer = () => {
        if (!token) {
            alert("Only logged in users can submit an answer.");
            return;
        }

        if (!newAnswer.trim()) return;

        Api.postAnswer(questionId, { body: newAnswer }, token)
            .then(() => {
                setNewAnswer("");
                return Api.fetchAnswersByQuestionId(questionId);
            })
            .then(res => res.json())
            .then(data => setAnswers(data.result))
            .catch(err => console.error("Failed to post answer:", err));
    };


    const handleDeleteAnswer = (answerId) => {
        Api.deleteAnswer(answerId, token)
            .then(() => Api.fetchAnswersByQuestionId(questionId))
            .then(res => res.json())
            .then(data => setAnswers(data.result))
            .catch(err => console.error("Delete answer failed:", err));
    };

    const handleEditAnswer = (answerId) => {
        Api.editAnswer(answerId, { body: editedAnswerBody }, token)
            .then(() => {
                setEditingAnswerId(null);
                setEditedAnswerBody("");
                return Api.fetchAnswersByQuestionId(questionId);
            })
            .then(res => res.json())
            .then(data => setAnswers(data.result))
            .catch(err => console.error("Edit answer failed:", err));
    };

    const handleEditQuestion = () => {
        Api.editQuestion(questionId, { title: editedQuestionTitle, body: editedQuestionBody, tags: editedQuestionTags }, token)
            .then(() => {
                setEditingQuestion(false);
                return Api.fetchSingleQuestion(questionId);
            })
            .then(res => res.json())
            .then(data => setQuestion(data));
    };

    function formatTimeAgo(timestamp) {
        const time = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - time) / 1000); // in seconds

        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }



    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/questions")}>Back to Questions</Button>

            {question && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h4">{question.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        Asked by {question.createdBy} {formatTimeAgo(question.timeStamp)}
                    </Typography>
                    {editingQuestion ? (
                        <>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Question Title</Typography>
                            <input
                                type="text"
                                placeholder="Edit title"
                                value={editedQuestionTitle}
                                onChange={(e) => setEditedQuestionTitle(e.target.value)}
                                style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
                            />
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Question Body</Typography>
                            <textarea
                                value={editedQuestionBody}
                                onChange={(e) => setEditedQuestionBody(e.target.value)}
                                rows={4}
                                style={{ width: "100%", padding: "8px" }}
                            />

                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Question Tags</Typography>
                            <input
                                type="text"
                                placeholder="Edit tags (comma-separated)"
                                value={editedQuestionTags}
                                onChange={(e) => setEditedQuestionTags(e.target.value)}
                                style={{ width: "100%", marginBottom: "8px", padding: "8px" }}
                            />

                            <Button onClick={handleEditQuestion} sx={{ mt: 1 }} variant="contained">Save</Button>

                        </>
                    ) : (
                        <Typography sx={{ my: 2 }}>{question.body}</Typography>
                    )}


                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => handleQuestionVote("up")}>
                            <ThumbUpAltIcon sx={{
                                color: question.votes?.find(v => v.username === username && v.voteType === "upvote")
                                    ? "green"
                                    : "inherit"
                            }} />
                        </IconButton>

                        <Typography>{question.voteCount || 0}</Typography>

                        <IconButton onClick={() => handleQuestionVote("down")}>
                            <ThumbDownAltIcon sx={{
                                color: question.votes?.find(v => v.username === username && v.voteType === "downvote")
                                    ? "red"
                                    : "inherit"
                            }} />
                        </IconButton>

                        {question.createdBy === username && (
                            <>
                                <Button onClick={() => {
                                    setEditedQuestionTitle(question.title);
                                    setEditedQuestionBody(question.body);
                                    setEditedQuestionTags(question.tags?.join(", ") || "");
                                    setEditingQuestion(true);
                                }}>Edit</Button>
                                <Button onClick={handleDeleteQuestion} color="error">Delete</Button>
                            </>
                        )}
                    </Stack>


                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6">Answers ({answers.length})</Typography>
                    {answers.map((ans, idx) => (
                        <Box key={ans._id || idx} sx={{ mt: 2, border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
                            {editingAnswerId === ans._id ? (
                                <>
                                    <textarea
                                        value={editedAnswerBody}
                                        onChange={(e) => setEditedAnswerBody(e.target.value)}
                                        rows={3}
                                        style={{ width: "100%", padding: "8px" }}
                                    />
                                    <Button onClick={() => handleEditAnswer(ans._id)} sx={{ mt: 1 }} variant="contained">Save</Button>
                                </>
                            ) : (
                                <Typography>{ans.body}</Typography>
                            )}

                            <Typography variant="caption" color="text.secondary">
                                Answered by {ans.createdBy} {formatTimeAgo(ans.timeStamp)}
                            </Typography>


                            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                                <IconButton onClick={() => handleAnswerVote(ans._id, "up")}>
                                    <ThumbUpAltIcon sx={{
                                        color: ans.votes?.find(v => v.username === username && v.voteType === "upvote")
                                            ? "green"
                                            : "inherit"
                                    }} />
                                </IconButton>

                                <Typography>{ans.voteCount || 0}</Typography>

                                <IconButton onClick={() => handleAnswerVote(ans._id, "down")}>
                                    <ThumbDownAltIcon sx={{
                                        color: ans.votes?.find(v => v.username === username && v.voteType === "downvote")
                                            ? "red"
                                            : "inherit"
                                    }} />
                                </IconButton>

                                {ans.createdBy === username && (
                                    <>
                                        <Button onClick={() => {
                                            setEditedAnswerBody(ans.body);
                                            setEditingAnswerId(ans._id);
                                        }}>Edit</Button>
                                        <Button onClick={() => handleDeleteAnswer(ans._id)} color="error">Delete</Button>
                                    </>
                                )}
                            </Stack>

                        </Box>
                    ))}

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>Post an Answer</Typography>
                        <textarea
                            rows={5}
                            value={newAnswer}
                            onChange={(e) => setNewAnswer(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontFamily: "arial" }}
                        />
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handlePostAnswer}>
                            Submit Answer
                        </Button>
                    </Box>


                </Box>
            )}
        </Box>
    );
}

export default SingleQuestionPage;