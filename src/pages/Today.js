import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import AddTaskFab from '../components/AddTaskFab';
import { useTaskContext } from '../context/TaskContext';
import styles from './Today.module.css';
import { labelColor } from '../utils';

const Today = () => {
  const { getTodayTasks } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const tasks = getTodayTasks();
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h5" className={styles.title} component="span">
          Today
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" component="span">
          {dateString}
        </Typography>
      </Box>

      <TaskList tasks={tasks} grouped={false} />
      
      <AddTaskFab onClick={() => setIsAddModalOpen(true)} />
      
      <AddTaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Box>
  );
};

export default Today; 