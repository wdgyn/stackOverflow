import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Api from "../services/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    Api.loginUser({ email, password })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (res.ok) {
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
        console.error("Login failed", err);
      });
  };
  
  

  return (
    <Box sx={{ width: 300, mx: "auto", mt: 8 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/questions")}>Back to Home</Button>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" fullWidth onClick={handleSubmit}>Login</Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Don’t have an account?{" "}
        <Link to="/register">Register here</Link>
      </Typography>
    </Box>
  );
}

export default LoginPage;
