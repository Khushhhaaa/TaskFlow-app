import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const USERS_KEY = "users";
const AUTH_KEY = "authUser";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 350, width: "100%", bgcolor: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#181a1b' : '#fff', color: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#fff' : '#222' }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Sign In</Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
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
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignIn; 