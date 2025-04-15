import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Avatar
} from "@mui/material";
import { Link } from "react-router-dom";
import Api from "../services/api"; // ⬅️ Needed to call fetchAnswersByQuestionId

function QuestionCard({ questionFish }) {
  const [answerCount, setAnswerCount] = useState(0);

  useEffect(() => {
    Api.fetchAnswersByQuestionId(questionFish._id)
      .then(res => res.json())
      .then(data => setAnswerCount(data.result?.length || 0))
      .catch(err => console.error("Error fetching answers count:", err));
  }, [questionFish._id]);

  function formatTimeAgo(timestamp) {
    const time = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <Card variant="outlined" sx={{ width: 700, mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ minWidth: '80px', textAlign: 'center', mr: 2 }}>
            <Typography variant="body2">{questionFish.voteCount} votes</Typography>
            <Typography variant="body2" color="success.main">
              {answerCount} answer
            </Typography>
            <Typography variant="body2">{questionFish.views || 0} views</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              <Link to={`/questions/${questionFish._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                {questionFish.title}
              </Link>
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {questionFish.tags?.map((tag, index) => (
                <Chip key={index} label={tag} size="small" />
              ))}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ width: 24, height: 24 }} />
              <Typography variant="caption">
                Posted by {questionFish.createdBy || "anonymous"} {formatTimeAgo(questionFish.timeStamp)}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default QuestionCard;
