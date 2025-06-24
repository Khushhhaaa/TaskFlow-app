import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const POMODORO_MINUTES = 25;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const TimerModal = ({ open, onClose, task }) => {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_MINUTES * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setSecondsLeft(POMODORO_MINUTES * 60);
      setRunning(false);
      clearInterval(intervalRef.current);
      return;
    }
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            // Optionally: play sound or show notification
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [open, running]);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(POMODORO_MINUTES * 60);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Pomodoro Timer
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" align="center" gutterBottom>
          {task?.title || 'Task'}
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={2}>
          <Typography variant="h2" fontWeight={700}>
            {formatTime(secondsLeft)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        {running ? (
          <Button onClick={handlePause} variant="contained" color="warning">Pause</Button>
        ) : (
          <Button onClick={handleStart} variant="contained" color="primary">Start</Button>
        )}
        <Button onClick={handleReset} variant="outlined">Reset</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimerModal; 