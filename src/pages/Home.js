import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper, Grid, Chip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Logo from "../components/Logo";

const AUTH_KEY = "authUser";
const STREAK_KEY = "taskStreak";

const Home = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem(AUTH_KEY);
  const [streak, setStreak] = useState(Number(localStorage.getItem(STREAK_KEY)) || 0);

  useEffect(() => {
    setStreak(Number(localStorage.getItem(STREAK_KEY)) || 0);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f7f8fa 0%, #e0e7ff 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%", textAlign: "center", mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Logo size="large" />
        </Box>
        <Typography variant="h6" mb={3}>
          Organize your day, boost your productivity, and keep your streak alive!
        </Typography>
        <Grid container spacing={2} justifyContent="center" mb={3}>
          <Grid item>
            <Chip icon={<AddTaskIcon />} label="Add Tasks" color="primary" sx={{ fontWeight: 600 }} />
          </Grid>
          <Grid item>
            <Chip icon={<ListAltIcon />} label="List & Edit" color="secondary" sx={{ fontWeight: 600 }} />
          </Grid>
          <Grid item>
            <Chip icon={<EmojiEventsIcon />} label="Streaks" color="warning" sx={{ fontWeight: 600 }} />
          </Grid>
        </Grid>
        {!isAuth ? (
          <>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 2, width: "100%", background: "#6C5CE7" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{ width: "100%", borderColor: "#6C5CE7", color: "#6C5CE7" }}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" mb={1}>
              Your Current Streak:
            </Typography>
            <Chip
              icon={<EmojiEventsIcon sx={{ color: streak > 0 ? "#FFD700" : "#aaa" }} />}
              label={`Streak: ${streak} day${streak === 1 ? "" : "s"}`}
              color={streak > 0 ? "warning" : "default"}
              sx={{ fontWeight: 600, mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "100%", background: "#6C5CE7", mt: 2 }}
              onClick={() => navigate("/dashboard")}
              startIcon={<ListAltIcon />}
            >
              Go to Dashboard
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Home; 