import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Typography,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import { useTaskContext } from '../context/TaskContext';
import { useProjectContext } from '../context/ProjectContext';
import { PRIORITY_COLORS } from '../context/TaskContext';
import AddTaskModal from './AddTaskModal';
import TimerModal from './TimerModal';
import styles from './TaskItem.module.css';
import { labelColor } from '../utils';

const TaskItem = ({ task }) => {
  const { toggleTask, deleteTask, updateTask } = useTaskContext();
  const { projects } = useProjectContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  const project = projects.find(p => p._id === task.projectId);

  const handleToggle = () => {
    toggleTask(task._id);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteTask(task._id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 2000);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const handleSubtaskToggle = (idx) => {
    if (!task.subtasks) return;
    const updatedSubtasks = task.subtasks.map((s, i) => i === idx ? { ...s, completed: !s.completed } : s);
    updateTask({ ...task, subtasks: updatedSubtasks });
  };

  return (
    <>
      <Box className={styles.container} style={project ? { borderLeft: `6px solid ${project.color}` } : {}}>
        <Box className={styles.leftSection}>
          <Checkbox
            checked={task.completed}
            onChange={handleToggle}
            className={styles.checkbox}
          />
          <Box className={styles.content}>
            <Typography
              variant="body1"
              className={`${styles.title} ${task.completed ? styles.completed : ''}`}
              component="span"
            >
              {task.title}
            </Typography>
            <Box className={styles.details}>
              {task.notes && (
                <Tooltip title={task.notes}>
                  <DescriptionIcon className={styles.icon} fontSize="small" />
                </Tooltip>
              )}
              {task.dueDate && (
                <Box className={styles.dueDate} component="span">
                  <EventIcon className={styles.icon} fontSize="small" />
                  <Typography variant="caption" component="span">
                    {formatDate(task.dueDate)}
                  </Typography>
                </Box>
              )}
              {task.priority && (
                <FlagIcon
                  className={styles.icon}
                  fontSize="small"
                  style={{ color: PRIORITY_COLORS[task.priority] }}
                />
              )}
              {task.labels && task.labels.length > 0 && (
                <Box className={styles.labels} component="span" sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                  {task.labels.map(label => (
                    <span
                      key={label}
                      style={{
                        background: labelColor(label),
                        color: '#fff',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'inline-block',
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </Box>
              )}
              {project && (
                <Tooltip title={project.name}>
                  <span className={styles.projectDot} style={{ background: project.color }} />
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>
        <Box className={styles.actions}>
          <IconButton
            size="small"
            onClick={() => setShowEditModal(true)}
            className={styles.actionButton}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleDelete}
            className={`${styles.actionButton} ${showDeleteConfirm ? styles.deleteConfirm : ''}`}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => setTimerOpen(true)}
            className={styles.actionButton}
          >
            <TimerIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {task.subtasks && task.subtasks.length > 0 && (
        <Box sx={{ mt: 1, mb: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Subtasks
          </Typography>
          <Box>
            {task.subtasks.map((sub, idx) => (
              <Box key={idx} display="flex" alignItems="center" gap={1}>
                <Checkbox
                  checked={!!sub.completed}
                  onChange={() => handleSubtaskToggle(idx)}
                  size="small"
                />
                <Typography variant="body2" sx={{ textDecoration: sub.completed ? 'line-through' : 'none', flex: 1 }}>
                  {sub.title}
                </Typography>
              </Box>
            ))}
          </Box>
          <LinearProgress
            variant="determinate"
            value={100 * (task.subtasks.filter(s => s.completed).length / task.subtasks.length)}
            sx={{ mt: 1, height: 6, borderRadius: 3 }}
          />
        </Box>
      )}

      <AddTaskModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        initialValues={task}
        isEdit
      />
      <TimerModal open={timerOpen} onClose={() => setTimerOpen(false)} task={task} />
    </>
  );
};

export default TaskItem; 