import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Fab,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Divider,
  Tabs,
  Tab,
  Paper
} from "@mui/material";
import { Add, Edit, Delete, Event } from "@mui/icons-material";
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils';

const API = "/api/tasks";
const palette = {
  primary: "#6C5CE7",
  accent: "#00B894",
  bg: "#F7F8FA",
  text: "#2D3748",
  today: "#FF7043",
  upcoming: "#42A5F5",
  done: "#00C853",
};

function statusColor(status) {
  if (status === "Done") return "success";
  if (status === "In Progress") return "info";
  return "warning";
}

function dueDateStatus(dueDate) {
  if (!dueDate) return null;
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  if (dueDate === tomorrow) return "tomorrow";
  return "upcoming";
}

function isToday(date) {
  const today = new Date().toISOString().slice(0, 10);
  return date === today;
}
function isUpcoming(date) {
  const today = new Date().toISOString().slice(0, 10);
  return date > today;
}

export default function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, title: "", notes: "", status: "To Do", dueDate: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [tab, setTab] = useState(0);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/tasks`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = [];
    }
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openAdd = () => {
    setForm({ id: null, title: "", notes: "", status: "To Do", dueDate: "" });
    setIsEdit(false);
    setShowForm(true);
  };
  const openEdit = (task) => {
    setForm({
      ...task,
      notes: typeof task.notes === 'string' ? task.notes : '',
    });
    setIsEdit(true);
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await fetch(`${API_BASE_URL}/api/tasks/${form._id}`, {
        method: "PUT",
        headers: token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "POST",
        headers: token ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` } : { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    fetchTasks();
  };

  // Filtering logic for tabs
  let filteredTasks = tasks;
  if (tab === 1) {
    filteredTasks = tasks.filter((t) => isToday(t.dueDate));
  } else if (tab === 2) {
    filteredTasks = tasks.filter((t) => isUpcoming(t.dueDate));
  }

  return (
    <Box sx={{ minHeight: "100vh", background: palette.bg, py: { xs: 2, md: 6 } }}>
      <Box sx={{ maxWidth: 600, mx: "auto", px: 2 }}>
        <Typography variant="h4" fontWeight={800} color={palette.primary} mb={2} sx={{ letterSpacing: 1, textAlign: "center" }}>
          Tasks
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          sx={{ mb: 2, ".MuiTabs-indicator": { background: palette.primary } }}
        >
          <Tab label="All" />
          <Tab label="Today" />
          <Tab label="Upcoming" />
        </Tabs>
        <Paper elevation={0} sx={{ background: "#fff", borderRadius: 3, boxShadow: "0 2px 12px 0 #e0e0e0" }}>
          <List disablePadding>
            {loading ? (
              <ListItem>
                <ListItemText primary="Loading..." />
              </ListItem>
            ) : filteredTasks.length === 0 ? (
              <ListItem>
                <ListItemText primary="No tasks found." />
              </ListItem>
            ) : (
              filteredTasks.map((task, idx) => {
                const dueStatus = dueDateStatus(task.dueDate);
                return (
                  <React.Fragment key={task._id}>
                    <ListItem
                      sx={{
                        alignItems: "flex-start",
                        py: 2,
                        borderBottom: idx !== filteredTasks.length - 1 ? "1px solid #f0f0f0" : "none",
                        transition: "background 0.2s",
                        ":hover": { background: "#f7f8fa" },
                      }}
                      secondaryAction={
                        <Box>
                          <IconButton color="primary" onClick={() => openEdit(task)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDelete(task._id)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Typography variant="h6" fontWeight={600} color={palette.text} component="span">
                              {task.title}
                            </Typography>
                            <Chip
                              label={task.status}
                              color={statusColor(task.status)}
                              size="small"
                              sx={{ fontWeight: 600, borderRadius: 1, ml: 1 }}
                            />
                          </span>
                        }
                        secondary={
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                            <Typography variant="body2" color="text.secondary" component="span">
                              {task.notes}
                            </Typography>
                            {task.dueDate && (
                              <Chip
                                icon={<Event />}
                                label={task.dueDate}
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  borderRadius: 1,
                                  ml: 1,
                                  background:
                                    dueStatus === "today"
                                      ? palette.today
                                      : dueStatus === "upcoming"
                                      ? palette.upcoming
                                      : dueStatus === "overdue"
                                      ? "#FF5252"
                                      : undefined,
                                  color:
                                    dueStatus === "today" || dueStatus === "upcoming" || dueStatus === "overdue"
                                      ? "#fff"
                                      : undefined,
                                }}
                              />
                            )}
                          </span>
                        }
                      />
                    </ListItem>
                  </React.Fragment>
                );
              })
            )}
          </List>
        </Paper>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: { xs: 24, md: 40 },
            right: { xs: 24, md: 40 },
            background: palette.primary,
            boxShadow: "0 4px 24px 0 #b2a4ff",
            zIndex: 1000,
          }}
          onClick={openAdd}
        >
          <Add />
        </Fab>
        <Dialog open={showForm} onClose={closeForm} maxWidth="sm" fullWidth>
          <DialogTitle>{isEdit ? "Edit Task" : "Add Task"}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                autoFocus
              />
              <TextField
                label="Notes"
                name="notes"
                value={form.notes || ""}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Due Date"
                name="dueDate"
                type="date"
                value={form.dueDate || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeForm}>Cancel</Button>
              <Button type="submit" variant="contained" sx={{ background: palette.primary }}>
                {isEdit ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </Box>
  );
} 