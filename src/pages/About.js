import React from 'react';
import { Box, Typography, Paper, Divider, useTheme } from '@mui/material';

const About = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark' || (typeof window !== 'undefined' && document.body.dataset.theme === 'dark');

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 6, px: 2 }}>
      <Paper elevation={isDark ? 2 : 4} sx={{
        p: { xs: 2, md: 6 },
        borderRadius: 6,
        background: isDark ? '#181a1b' : '#f9fafe',
        color: isDark ? '#fff' : '#222',
        boxShadow: isDark ? '0 4px 24px 0 #0004' : '0 8px 32px 0 #e0e0e0',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        gap: 4,
      }}>
        <Box sx={{ flex: 2, minWidth: 0 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            About Flow
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Flow is a modern productivity app inspired by Todoist and TickTick, designed to help you organize your tasks, projects, and life with ease. With a clean, minimal UI and powerful features, Flow makes it simple to stay focused and get things done.
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Key Features
          </Typography>
          <ul style={{ color: isDark ? '#fff' : '#222', fontSize: '1.1rem', marginBottom: 24 }}>
            <li>Organize tasks by project, label, due date, and priority</li>
            <li>Subtasks, reminders, and recurring tasks</li>
            <li>Calendar view and progress tracking</li>
            <li>Import/export and data sync</li>
            <li>Fully responsive with light & dark mode</li>
          </ul>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Tech Stack
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>Frontend:</b> React, Material-UI (MUI), custom theming<br/>
            <b>Backend:</b> Node.js, Express, MongoDB
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Why Flow?
          </Typography>
          <Typography variant="body2" gutterBottom>
            Flow was built to practice and demonstrate modern web development, with a focus on usability, accessibility, and productivity. The goal is to provide a reliable, enjoyable tool for planning your day and achieving your goals.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Inspired by Todoist. Built with ❤️ by Khushi Soni.<br/>
            Special thanks to open source contributors and the React/MUI community.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default About; 