import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import styles from './AddTaskFab.module.css';

const AddTaskFab = ({ onClick }) => {
  return (
    <Tooltip title="Add New Task" placement="left">
      <Fab
        color="primary"
        aria-label="add task"
        onClick={onClick}
        className={styles.fab}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

export default AddTaskFab;