import React, { useState } from 'react';
import { Box, Typography, Collapse, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, ButtonGroup, Button } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import TaskItem from './TaskItem';
import { useTaskContext } from '../context/TaskContext';
import styles from './TaskList.module.css';

const TaskGroup = ({ title, tasks, expanded = true }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);

  if (!tasks || tasks.length === 0) return null;

  return (
    <Box className={styles.taskGroup}>
      <Box
        className={styles.groupHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Typography variant="subtitle1" className={styles.groupTitle}>
          {title} ({tasks.length})
        </Typography>
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={isExpanded}>
        <Box className={styles.taskList}>
          {tasks.map(task => (
            <TaskItem key={task._id} task={task} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

const sortFunctions = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  date: (a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0),
  priority: (a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  },
};

const TaskList = ({ tasks, grouped = true }) => {
  const { groupTasksByDate } = useTaskContext();
  const [showCompleted, setShowCompleted] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  let filtered = tasks;
  if (priorityFilter !== 'all') {
    filtered = filtered.filter(t => t.priority === priorityFilter);
  }
  if (!showCompleted) {
    filtered = filtered.filter(t => !t.completed);
  }
  filtered = [...filtered].sort(sortFunctions[sortBy]);

  return (
    <Box className={styles.container}>
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={e => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={e => setSortBy(e.target.value)}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="date">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Checkbox checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} />}
          label="Show Completed"
        />
      </Box>
      {filtered.length === 0 ? (
        <Typography color="textSecondary" className={styles.emptyState}>
          No tasks to display. Click the + button to add a task.
        </Typography>
      ) : grouped ? (
        (() => {
          const groupedTasks = groupTasksByDate(filtered);
          return (
            <>
              <TaskGroup
                title="Overdue"
                tasks={groupedTasks.overdue}
                expanded={true}
              />
              <TaskGroup
                title="Today"
                tasks={groupedTasks.today}
                expanded={true}
              />
              <TaskGroup
                title="Tomorrow"
                tasks={groupedTasks.tomorrow}
                expanded={true}
              />
              <TaskGroup
                title="Upcoming"
                tasks={groupedTasks.upcoming}
                expanded={false}
              />
              <TaskGroup
                title="No Due Date"
                tasks={groupedTasks.noDueDate}
                expanded={false}
              />
            </>
          );
        })()
      ) : (
        <Box className={styles.taskList}>
          {filtered.map(task => (
            <TaskItem key={task._id} task={task} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TaskList; 