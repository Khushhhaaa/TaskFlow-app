import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Collapse,
  IconButton,
  Typography,
  Checkbox,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useTaskContext, PRIORITY } from '../context/TaskContext';
import { useProjectContext } from '../context/ProjectContext';
import styles from './AddTaskModal.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

const AddTaskModal = ({ open, onClose, initialValues = {}, isEdit = false }) => {
  const { addTask, updateTask } = useTaskContext();
  const { projects } = useProjectContext();
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    dueDate: null,
    priority: PRIORITY.LOW,
    projectId: '',
    reminder: null,
    recurrence: '',
    subtasks: [],
    ...initialValues,
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (!open) return;

    if (isEdit && initialValues) {
      let dueDate = initialValues.dueDate;
      if (typeof dueDate === 'string') {
        dueDate = dueDate.trim() === '' || isNaN(Date.parse(dueDate)) ? null : new Date(dueDate);
      }
      setFormData({
        ...initialValues,
        title: initialValues.title || '',
        notes: initialValues.notes || '',
        dueDate: dueDate || null,
        priority: initialValues.priority || PRIORITY.LOW,
        projectId: initialValues.projectId || '',
        reminder: initialValues.reminder || null,
        recurrence: initialValues.recurrence || '',
        subtasks: initialValues.subtasks || [],
      });
    } else {
      setFormData({
        title: '',
        notes: '',
        dueDate: null,
        priority: PRIORITY.LOW,
        projectId: '',
        reminder: null,
        recurrence: '',
        subtasks: [],
      });
    }
    setErrors({});
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dueDate: date
    }));
  };

  const handleReminderChange = (date) => {
    setFormData(prev => ({ ...prev, reminder: date }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const taskData = {
      ...formData,
      title: formData.title.trim(),
      notes: formData.notes.trim(),
      status: formData.status || 'To Do',
      projectId: formData.projectId === '' ? null : formData.projectId,
      reminder: formData.reminder ? new Date(formData.reminder).toISOString() : null,
      recurrence: formData.recurrence || '',
      subtasks: formData.subtasks || [],
    };
    try {
      if (isEdit) {
        await updateTask(taskData);
      } else {
        const result = await addTask(taskData);
        if (result && result.error) {
          setBackendError(result.error);
          return;
        }
      }
      onClose();
    } catch (err) {
      setBackendError(err.message || 'Failed to add task');
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), { title: newSubtask.trim(), completed: false }],
      }));
      setNewSubtask('');
    }
  };

  const handleSubtaskChange = (idx, checked) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map((s, i) => i === idx ? { ...s, completed: checked } : s),
    }));
  };

  const handleDeleteSubtask = (idx) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== idx),
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className={styles.dialog}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className={styles.title}>
          {isEdit ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent className={styles.content}>
          {backendError && <Box color="error.main" mb={2}>{backendError}</Box>}
          <Box className={styles.fields}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              autoFocus
              required
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={
                  formData.dueDate && typeof formData.dueDate === 'string'
                    ? (isNaN(Date.parse(formData.dueDate)) ? null : new Date(formData.dueDate))
                    : (formData.dueDate instanceof Date && !isNaN(formData.dueDate) ? formData.dueDate : null)
                }
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
                disablePast
              />
            </LocalizationProvider>
            <Box mt={2} mb={1} display="flex" alignItems="center" style={{ cursor: 'pointer' }} onClick={() => setShowMore(v => !v)}>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                More options
              </Typography>
              <IconButton size="small" sx={{ ml: 1, transform: showMore ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <ExpandMoreIcon />
              </IconButton>
            </Box>
            <Collapse in={showMore}>
              <TextField
                name="notes"
                label="Notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                sx={{ mt: 1 }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Subtasks</Typography>
                <Box display="flex" gap={1} mb={1}>
                  <TextField
                    label="Add subtask"
                    value={newSubtask}
                    onChange={e => setNewSubtask(e.target.value)}
                    size="small"
                    fullWidth
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                  />
                  <Button onClick={handleAddSubtask} variant="contained">Add</Button>
                </Box>
                {formData.subtasks && formData.subtasks.length > 0 && (
                  <Box>
                    {formData.subtasks.map((sub, idx) => (
                      <Box key={idx} display="flex" alignItems="center" gap={1} mb={1}>
                        <Checkbox
                          checked={!!sub.completed}
                          onChange={e => handleSubtaskChange(idx, e.target.checked)}
                        />
                        <Typography variant="body2" sx={{ textDecoration: sub.completed ? 'line-through' : 'none', flex: 1 }}>
                          {sub.title}
                        </Typography>
                        <IconButton size="small" onClick={() => handleDeleteSubtask(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                >
                  <MenuItem value={PRIORITY.LOW}>Low</MenuItem>
                  <MenuItem value={PRIORITY.MEDIUM}>Medium</MenuItem>
                  <MenuItem value={PRIORITY.HIGH}>High</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Project</InputLabel>
                <Select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  label="Project"
                >
                  <MenuItem value="">None</MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project._id} value={project._id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <DateTimePicker
                label="Remind me"
                value={formData.reminder}
                onChange={handleReminderChange}
                slotProps={{ textField: { fullWidth: true } }}
                minDateTime={new Date()}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Repeat</InputLabel>
                <Select
                  name="recurrence"
                  value={formData.recurrence}
                  onChange={handleChange}
                  label="Repeat"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
            </Collapse>
          </Box>
        </DialogContent>
        <DialogActions className={styles.actions}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTaskModal;