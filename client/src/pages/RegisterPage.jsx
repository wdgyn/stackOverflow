import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Api from "../services/api";

function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "" });

  const navigate = useNavigate();

  const handleSubmit = () => {
    Api.registerUser(form)
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (res.ok) {
          alert("Registration successful!");
          const { token, userId, username } = data;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("username", username);
          navigate("/questions");
        } else {
          alert(data.error);
        }
      })
      .catch(err => {
        console.error("Registration failed", err);
      });
  };
  

  return (
    <Box sx={{ width: 300, mx: "auto", mt: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/questions")}>Back to Home</Button>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <TextField label="Full Name" fullWidth margin="normal" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
      <TextField label="Username" fullWidth margin="normal" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
      <TextField label="Email" fullWidth margin="normal" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <Button variant="contained" fullWidth onClick={handleSubmit}>Register</Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link to="/login">Login here</Link>
      </Typography>
    </Box>
  );
}

export default RegisterPage;
