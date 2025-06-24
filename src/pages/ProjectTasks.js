import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import { Add, Edit, Delete, Event, Label, FilterList } from "@mui/icons-material";
import { useAuth } from '../context/AuthContext';
import { labelColor, API_BASE_URL } from '../utils';

const API = `${API_BASE_URL}/api/tasks`;
const palette = {
  primary: "#6C5CE7",
  bg: "#F7F8FA",
  text: "#2D3748",
};

function statusColor(status) {
  if (status === "Done") return "success";
  if (status === "In Progress") return "info";
  return "warning";
}

export default function ProjectTasks() {
  const { projectId } = useParams();
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [addModalInitialValues, setAddModalInitialValues] = useState({});
  const [form, setForm] = useState({ title: "", notes: "", status: "To Do", dueDate: "", labels: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeLabels, setActiveLabels] = useState([]);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch(`${API}?projectId=${projectId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (res.status === 401) {
      logout && logout();
      setTasks([]);
      setLoading(false);
      return;
    }
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
    // eslint-disable-next-line
  }, [projectId]);

  const openAdd = () => {
    setForm({ title: "", notes: "", status: "To Do", dueDate: "", labels: "" });
    setIsEdit(false);
    setAddModalInitialValues({ projectId });
    setShowForm(true);
  };
  const openEdit = (task) => {
    setForm({
      title: task.title,
      notes: task.notes,
      status: task.status,
      dueDate: task.dueDate,
      labels: (task.labels || []).join(", "),
    });
    setEditId(task._id);
    setIsEdit(true);
    setShowForm(true);
  };
  const closeForm = () => setShowForm(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const labelsArr = form.labels
      ? form.labels.split(",").map((l) => l.trim()).filter(Boolean)
      : [];
    const payload = { ...form, labels: labelsArr, projectId };
    let res;
    if (isEdit) {
      res = await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: token
          ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
          : { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      res = await fetch(API, {
        method: "POST",
        headers: token
          ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
          : { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    if (res.ok) {
      setShowForm(false);
      fetchTasks();
    } else {
      const errorData = await res.json().catch(() => ({}));
      alert(errorData.error || errorData.message || 'Failed to save task.');
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    fetchTasks();
  };

  // Collect all unique labels from tasks
  const allLabels = Array.from(
    new Set(tasks.flatMap((t) => t.labels || []))
  );
  // Filtering logic
  const filteredTasks =
    activeLabels.length === 0
      ? tasks
      : tasks.filter((task) =>
          (task.labels || []).some((l) => activeLabels.includes(l))
        );

  return (
    <Box sx={{ minHeight: "100vh", background: palette.bg, py: { xs: 2, md: 6 } }}>
      <Box sx={{ maxWidth: 600, mx: "auto", px: 2 }}>
        <Typography variant="h4" fontWeight={800} color={palette.primary} mb={2} sx={{ letterSpacing: 1, textAlign: "center" }}>
          Project
        </Typography>
        {/* Label filter bar */}
        {allLabels.length > 0 && (
          <Stack direction="row" spacing={1} mb={2} alignItems="center">
            <FilterList color="action" />
            {allLabels.map((label) => (
              <Chip
                key={label}
                label={label}
                icon={<Label style={{ color: labelColor(label) }} />}
                onClick={() =>
                  setActiveLabels((prev) =>
                    prev.includes(label)
                      ? prev.filter((l) => l !== label)
                      : [...prev, label]
                  )
                }
                sx={{
                  background: activeLabels.includes(label)
                    ? labelColor(label)
                    : "#f0f0f0",
                  color: activeLabels.includes(label) ? "#fff" : palette.text,
                  fontWeight: 600,
                  borderRadius: 1,
                  cursor: "pointer",
                  border: activeLabels.includes(label)
                    ? "2px solid #333"
                    : "1px solid #eee",
                  transition: "all 0.15s",
                }}
                variant={activeLabels.includes(label) ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        )}
        <List disablePadding>
          {loading ? (
            <ListItem>
              <ListItemText primary="Loading..." primaryTypographyProps={{ component: 'span' }} />
            </ListItem>
          ) : filteredTasks.length === 0 ? (
            <ListItem>
              <ListItemText primary={
                activeLabels.length > 0
                  ? "No tasks match the selected label(s)."
                  : "No tasks for this project."
              } primaryTypographyProps={{ component: 'span' }} />
            </ListItem>
          ) : (
            filteredTasks.map((task, idx) => (
              <ListItem
                key={task._id}
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
                  primaryTypographyProps={{ component: 'span' }}
                  primary={
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Typography variant="h6" fontWeight={600} color={palette.text} component="span">
                        {task.title}
                      </Typography>
                      <Chip
                        label={task.status}
                        color={statusColor(task.status)}
                        size="small"
                        sx={{ fontWeight: 600, borderRadius: 1, ml: 1 }}
                        component="span"
                      />
                      {task.labels && task.labels.length > 0 && (
                        <span style={{ display: 'inline-flex', gap: 4, marginLeft: 4 }}>
                          {task.labels.map((label) => (
                            <Chip
                              key={label}
                              icon={<Label style={{ color: labelColor(label) }} />}
                              label={label}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                borderRadius: 1,
                                background: labelColor(label),
                                color: "#fff",
                              }}
                              component="span"
                            />
                          ))}
                        </span>
                      )}
                    </span>
                  }
                  secondary={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Typography variant="body2" color="text.secondary" component="span">
                        {task.notes}
                      </Typography>
                      {task.dueDate && (
                        <Chip
                          icon={<Event />}
                          label={task.dueDate}
                          size="small"
                          sx={{ fontWeight: 600, borderRadius: 1, ml: 1 }}
                          component="span"
                        />
                      )}
                    </span>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
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
            transition: "background 0.2s",
            ":hover": { background: "#4b3bbd" },
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
                value={form.notes}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                sx={{ mt: 1 }}
              />
              <TextField
                label="Labels (comma separated)"
                name="labels"
                value={form.labels}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="e.g. work, urgent"
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