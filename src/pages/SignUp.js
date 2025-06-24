import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const USERS_KEY = "users";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (users.find((u) => u.email === email)) {
      setError("Email already registered.");
      return;
    }
    users.push({ name, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    navigate("/signin");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 350, width: "100%", bgcolor: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#181a1b' : '#fff', color: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#fff' : '#222' }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonAddAltIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Sign Up</Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" color="secondary" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Typography variant="body2" align="center">
            Already have an account? <Link to="/signin">Sign In</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUp; 