import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import QuestionCard from "../components/QuestionCard";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import TopNavBar from "../components/TopNavBar";
import QuestionFilterDropdown from "../components/QuestionFilterDropdown";
import Api from "../services/api";

function ForumPage() {
  const [questions, setQuestions] = useState([]);
  const [filter, setFilter] = useState("mostRecent");

  
  const [username, setUsername] = useState(localStorage.getItem("username"));
  useEffect(() => {
    const handleStorageChange = () => {
      setUsername(localStorage.getItem("username"));
    };
  
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  useEffect(() => {
    if (filter.startsWith("tags:")) {
      const tag = filter.split(":")[1];
      Api.fetchQuestionsBySelectedTag(tag)
        .then((res) => res.json())
        .then((questions) => setQuestions(questions))
        .catch((err) => console.error("Failed to fetch questions by tag:", err));
    } else {
      Api.fetchAllQuestions()
      .then((res) => res.json())
      .then((questions) => {
        const sortedByNewest = [...questions].sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
        setQuestions(sortedByNewest);
      })    
      .catch((err) => console.error("Failed to fetch questions:", err));
    }
  }, [filter]);

  return (
    <Box sx={{ width: '100%', height: '100%', m: 0, p: 0, boxSizing: 'border-box' }}>
      <TopNavBar />

      <Box sx={{ maxWidth: '100%', px: 6, mt: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={2}>
            <LeftSidebar />
          </Grid>

          <Grid item xs={12} md={8}>
            {username && (
              <Typography variant="h6" sx={{ mb: 1 }}>
                Welcome, <strong>{username}</strong>!
              </Typography>
            )}
            <QuestionFilterDropdown filter={filter} setFilter={setFilter} />
            {questions.filter((question) => {
              if (filter === "hot") return question.voteCount >= 3;
              return true; // skip other filters, already handled via API
            })
              .map((question) => (
                <QuestionCard key={question._id} questionFish={question} />
              ))}
          </Grid>
          <Grid item xs={12} md={2}>
            <RightSidebar />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ForumPage;
