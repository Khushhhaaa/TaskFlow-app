import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTaskContext } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import styles from './Today.module.css';

const Upcoming = () => {
  const { tasks } = useTaskContext();
  const now = new Date();
  // Only tasks with a dueDate in the future (not today)
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    return due > now && due.toDateString() !== now.toDateString();
  });

  return (
    <Box className={styles.container}>
      <Typography variant="h5" component="h1" className={styles.title}>
        Upcoming
      </Typography>
      <TaskList tasks={upcomingTasks} grouped={true} />
    </Box>
  );
};

export default Upcoming; 