import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Api from "../services/api";

function AskQuestionPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    body: "",
    tags: ""
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to post a question.");
      return;
    }

    try {
      const res = await Api.postQuestion(form, token);
      if (res.ok) {
        alert("Question posted successfully!");
        navigate("/questions");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to post question.");
      }
    } catch (err) {
      console.error("Post failed", err);
      alert("Something went wrong.");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 5 }}>
      <Button variant="outlined" onClick={() => navigate("/questions")}>
        ← Back to Home
      </Button>

      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Ask a Question
      </Typography>

      <TextField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Body"
        name="body"
        value={form.body}
        onChange={handleChange}
        fullWidth
        multiline
        minRows={5}
        margin="normal"
      />

      <TextField
        label="Tags (comma-separated)"
        name="tags"
        value={form.tags}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
        Post Question
      </Button>
    </Box>
  );
}

export default AskQuestionPage;
