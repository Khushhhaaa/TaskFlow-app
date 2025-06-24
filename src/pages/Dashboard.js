import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Fab,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Skeleton,
  Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useTaskContext } from '../context/TaskContext';
import { useProjectContext } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import productivityImg from '../assets/undraw_productivity.png';
import AddTaskModal from '../components/AddTaskModal';

const AUTH_KEY = "authUser";
const STREAK_KEY = "taskStreak";
const LAST_DONE_KEY = "lastTaskDone";
const API = "/api/tasks";

const palette = {
  primary: "#6C5CE7",
  accent: "#00B894",
  bg: "linear-gradient(135deg, #f7f8fa 0%, #e0e7ff 100%)",
  card: "#fff",
  text: "#2D3748",
  stat1: "#6C5CE7",
  stat2: "#00B894",
  stat3: "#00B0FF",
  stat4: "#00C853",
};

const mockTasks = [
  { id: 1, title: "Design homepage", status: "In Progress" },
  { id: 2, title: "Setup backend API", status: "To Do" },
  { id: 3, title: "Write documentation", status: "Done" },
  { id: 4, title: "Create dashboard widgets", status: "To Do" },
  { id: 5, title: "Test notifications", status: "In Progress" },
  { id: 6, title: "Deploy app", status: "Done" },
];

const mockActivity = [
  { id: 1, text: "Task 'Deploy app' marked as Done", icon: <CheckCircleIcon color="success" /> },
  { id: 2, text: "Task 'Test notifications' set to In Progress", icon: <HourglassEmptyIcon color="warning" /> },
  { id: 3, text: "Task 'Create dashboard widgets' added", icon: <AddIcon color="primary" /> },
];

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getTodayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getTodayString() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const Dashboard = () => {
  const { tasks, loading: tasksLoading, addTask } = useTaskContext();
  const { projects, loading: projectsLoading } = useProjectContext();
  const { token, logout, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(Number(localStorage.getItem(STREAK_KEY)) || 0);
  const [lastDone, setLastDone] = useState(localStorage.getItem(LAST_DONE_KEY) || "");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();
  const isDark = (typeof window !== 'undefined' && document.body.dataset.theme === 'dark');

  useEffect(() => {
    fetch(API, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (res.status === 401) {
          logout();
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        setLoading(false);
      });
  }, [navigate, token, logout]);

  // Streak logic
  useEffect(() => {
    if (lastDone && lastDone !== getToday()) {
      // If last done was not today or yesterday, reset streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDone !== yesterday.toISOString().slice(0, 10)) {
        setStreak(0);
        localStorage.setItem(STREAK_KEY, "0");
      }
    }
  }, [lastDone]);

  // Stats
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length;
  const todayStr = new Date().toISOString().slice(0, 10);
  const totalDueToday = tasks.filter(t => t.dueDate && t.dueDate.slice(0, 10) === todayStr).length;
  const incompleteDueToday = tasks.filter(t => t.dueDate && t.dueDate.slice(0, 10) === todayStr && !t.completed).length;
  const completedDueToday = tasks.filter(t => t.dueDate && t.dueDate.slice(0, 10) === todayStr && t.completed).length;

  // Recent activity (last 5 updated/created/completed tasks)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);

  // Animated counters (simple fade-in)
  const [displayStats, setDisplayStats] = useState({ total: 0, completed: 0, overdue: 0, today: 0 });
  useEffect(() => {
    let frame;
    let step = 0;
    function animate() {
      step += 1;
      setDisplayStats({
        total: Math.min(Math.round((total * step) / 20), total),
        completed: Math.min(Math.round((completed * step) / 20), completed),
        overdue: Math.min(Math.round((overdue * step) / 20), overdue),
        today: Math.min(Math.round((incompleteDueToday * step) / 20), incompleteDueToday),
      });
      if (step < 20) frame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [total, completed, overdue, incompleteDueToday]);

  // Project progress
  const getProjectProgress = (project) => {
    const projectTasks = tasks.filter(t => t.projectId === project._id);
    const done = projectTasks.filter(t => t.completed).length;
    return {
      total: projectTasks.length,
      done,
      percent: projectTasks.length ? (done / projectTasks.length) * 100 : 0
    };
  };

  // Handlers
  const handleStatClick = (type) => {
    if (type === 'overdue') navigate('/today');
    else if (type === 'today') navigate('/today');
    else if (type === 'completed') navigate('/inbox');
    else navigate('/tasks');
  };

  // User greeting
  const greeting = user ? `Welcome back, ${user.name || user.email || 'User'}!` : 'Welcome to your Dashboard';

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', py: 4 }}>
      <Paper elevation={isDark ? 2 : 4} sx={{
        p: { xs: 2, md: 6 },
        borderRadius: 6,
        background: isDark ? '#181a1b' : '#f9fafe',
        color: isDark ? '#fff' : '#2d3748',
        boxShadow: isDark ? '0 4px 24px 0 #0004' : '0 8px 32px 0 #e0e0e0',
        mb: 4,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 4,
      }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h3" fontWeight={800} mb={2}>
            Welcome{user?.name ? `, ${user.name}` : ''}!
          </Typography>
          <Typography variant="h6" mb={3} color={isDark ? '#e0e0e0' : '#5c6f7c'}>
            Stay organized and productive. Every small step counts!
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Typography variant="body2" color="textSecondary">Today's Progress</Typography>
            <LinearProgress variant="determinate" value={totalDueToday ? (completedDueToday / totalDueToday) * 100 : 0} sx={{ width: 120, height: 10, borderRadius: 5, background: '#eee' }} />
            <Typography variant="body2" color="success.main">{completedDueToday}/{totalDueToday}</Typography>
          </Box>
          <Typography variant="body2" color="primary.main" fontStyle="italic" mb={2}>
            "Every small step counts. Keep going!"
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" color="primary" onClick={() => setIsAddModalOpen(true)}>
              Add Task
            </Button>
            <Button variant="outlined" color="primary" onClick={() => navigate('/today')}>
              Go to Today
            </Button>
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          <img src={productivityImg} alt="Productivity Illustration" style={{ maxWidth: '340px', width: '100%', height: 'auto' }} />
        </Box>
      </Paper>
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleStatClick('total')} sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}>
            <CardContent>
              <Typography variant="h6">Total Tasks</Typography>
              {tasksLoading ? <Skeleton width={40} height={40} /> : <Typography variant="h4" color="primary">{displayStats.total}</Typography>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleStatClick('completed')} sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}>
            <CardContent>
              <Typography variant="h6">Completed</Typography>
              {tasksLoading ? <Skeleton width={40} height={40} /> : <Typography variant="h4" color="success.main">{displayStats.completed}</Typography>}
              <LinearProgress variant="determinate" value={total ? (completed / total) * 100 : 0} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleStatClick('overdue')} sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}>
            <CardContent>
              <Typography variant="h6">Overdue</Typography>
              {tasksLoading ? <Skeleton width={40} height={40} /> : <Typography variant="h4" color="error.main">{displayStats.overdue}</Typography>}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card onClick={() => handleStatClick('today')} sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}>
            <CardContent>
              <Typography variant="h6">Due Today</Typography>
              {tasksLoading ? <Skeleton width={40} height={40} /> : <Typography variant="h4" color="warning.main">{incompleteDueToday}</Typography>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="h6" mb={2}>Recent Activity</Typography>
      <Card sx={{ mb: 4 }}>
        <List>
          {tasksLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <ListItem key={i}><Skeleton width="100%" height={32} /></ListItem>
            ))
          ) : recentTasks.length === 0 ? (
            <ListItem><ListItemText primary="No recent activity yet." /></ListItem>
          ) : recentTasks.map((task, idx) => (
            <React.Fragment key={task._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: task.completed ? palette.stat2 : palette.stat1 }}>
                    {task.completed ? <CheckCircleIcon /> : <AssignmentIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<span style={{ fontWeight: 600 }}>{task.title}</span>}
                  secondary={
                    <span>
                      {task.completed ? 'Completed' : 'Updated'} {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : ''}
                      {task.dueDate && (
                        <span style={{ color: new Date(task.dueDate) < new Date() && !task.completed ? '#d32f2f' : '#888', marginLeft: 8 }}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </span>
                  }
                />
              </ListItem>
              {idx < recentTasks.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Card>
      <Typography variant="h6" mb={2}>Projects</Typography>
      <Grid container spacing={2} mb={4}>
        {projectsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))
        ) : projects.length === 0 ? (
          <Typography color="textSecondary" ml={2}>No projects yet.</Typography>
        ) : (
          projects.map(project => {
            const progress = getProjectProgress(project);
            return (
              <Grid item xs={12} sm={6} md={4} key={project._id}>
                <Card sx={{ borderLeft: `6px solid ${project.color}` }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {progress.total} tasks
                    </Typography>
                    <LinearProgress variant="determinate" value={progress.percent} sx={{ mt: 1, mb: 1 }} />
                    <Button size="small" onClick={() => navigate(`/project/${project._id}`)}>
                      View Tasks
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: { xs: 24, md: 40 }, right: { xs: 24, md: 40 }, background: palette.primary, boxShadow: "0 4px 24px 0 #b2a4ff", zIndex: 1000, transition: "background 0.2s", ":hover": { background: "#4b3bbd" } }}
        onClick={() => setIsAddModalOpen(true)}
      >
        <Tooltip title="Quick Add Task"><AddIcon /></Tooltip>
      </Fab>
      <AddTaskModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </Box>
  );
};

export default Dashboard; 