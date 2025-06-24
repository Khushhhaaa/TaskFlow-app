import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import AddTaskFab from '../components/AddTaskFab';
import { useTaskContext } from '../context/TaskContext';
import styles from './Inbox.module.css';

const Inbox = () => {
  const { getInboxTasks } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const tasks = getInboxTasks();

  return (
    <Box className={styles.container}>
      <Typography variant="h5" component="h1" className={styles.title}>
        Inbox
      </Typography>

      <TaskList tasks={tasks} grouped={false} />

      <AddTaskFab onClick={() => setIsAddModalOpen(true)} />

      <AddTaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Box>
  );
};

export default Inbox; 