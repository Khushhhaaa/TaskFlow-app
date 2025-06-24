import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTaskContext } from '../context/TaskContext';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import AddTaskModal from '../components/AddTaskModal';
import AddTaskFab from '../components/AddTaskFab';

const CalendarPage = () => {
  const { tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter tasks for the selected date
  const tasksForDate = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate).toDateString();
    return taskDate === selectedDate.toDateString();
  });

  // Helper to get all due dates for recurring tasks (for now, just next occurrence)
  function getTaskDueDates(task) {
    if (!task.dueDate) return [];
    if (!task.recurrence) return [new Date(task.dueDate).toDateString()];
    // Only show next occurrence for now
    return [new Date(task.dueDate).toDateString()];
  }

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsAddModalOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', py: 4 }}>
      <Typography variant="h4" fontWeight={800} mb={3} align="center">
        Calendar
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          onClickDay={handleDateClick}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const hasTask = tasks.some(task => {
                return getTaskDueDates(task).includes(date.toDateString());
              });
              return hasTask ? (
                <div style={{
                  marginTop: 2,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#6C5CE7',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }} />
              ) : null;
            }
            return null;
          }}
        />
      </Paper>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Tasks for {selectedDate.toLocaleDateString()}
      </Typography>
      <List>
        {tasksForDate.length === 0 ? (
          <ListItem>
            <ListItemText primary="No tasks for this date." />
          </ListItem>
        ) : (
          tasksForDate.map(task => (
            <ListItem key={task._id}>
              <ListItemText primary={task.title} secondary={task.notes} />
            </ListItem>
          ))
        )}
      </List>
      <AddTaskFab onClick={() => setIsAddModalOpen(true)} />
      <AddTaskModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialValues={{ dueDate: selectedDate }}
      />
    </Box>
  );
};

export default CalendarPage; 