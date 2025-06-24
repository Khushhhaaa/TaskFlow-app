import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  // Detect dark mode
  const isDark = (typeof window !== 'undefined' && document.body.dataset.theme === 'dark');
  return (
    <AppBar
      position="static"
      sx={{
        background: isDark ? '#181a1b' : '#fff',
        color: isDark ? '#fff' : '#2c3e50',
        boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.1)',
      }}
      elevation={2}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: isDark ? '#fff' : '#3498db' }}>
          TaskFlow
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <>
              <Tooltip title={user.name}>
                <Avatar sx={{ bgcolor: '#6C5CE7', width: 32, height: 32, fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                  {user.name[0].toUpperCase()}
                </Avatar>
              </Tooltip>
              <Typography variant="body2" sx={{ mr: 1, color: isDark ? '#fff' : 'inherit' }}>{user.name}</Typography>
              <Button onClick={() => navigate('/profile')} sx={{ ml: 1, color: isDark ? '#fff' : 'inherit' }}>
                Profile
              </Button>
            </>
          )}
          <ThemeToggle />
          <IconButton color="inherit" size="large" onClick={() => setSettingsOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          {/* Add settings content here if needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { logout(); setSettingsOpen(false); }} color="error" variant="outlined">Logout</Button>
          <Button onClick={() => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Header; 