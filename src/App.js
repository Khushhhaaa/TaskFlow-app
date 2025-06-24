import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { ProjectProvider } from './context/ProjectContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Inbox from './pages/Inbox';
import Today from './pages/Today';
import ProjectTasks from './pages/ProjectTasks';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Upcoming from './pages/Upcoming';
import Tasks from './pages/Tasks';
import CalendarPage from './pages/Calendar';
import About from './pages/About';
import styles from './App.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Dynamic theme function
function getTheme(mode) {
  return createTheme({
    palette: {
      mode,
      background: { default: mode === 'dark' ? '#181a1b' : '#F7F8FA' },
      primary: { main: '#6C5CE7' },
      secondary: { main: '#00B894' },
      text: {
        primary: mode === 'dark' ? '#fff' : '#2D3748',
        secondary: mode === 'dark' ? '#f7fafc' : '#555',
      },
    },
    shape: { borderRadius: 12 },
    typography: { fontFamily: 'Inter, Roboto, sans-serif' },
    components: {
      MuiPaper: { styleOverrides: { root: { boxShadow: '0 2px 12px 0 #e0e0e0', borderRadius: 12 } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
      MuiTextField: { styleOverrides: { root: { borderRadius: 12 } } },
      MuiListItem: { styleOverrides: { root: { borderRadius: 12 } } },
    }
  });
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
  return (
    <ProjectProvider>
      <TaskProvider>
        <div className={styles.app}>
          <Header />
          <div className={styles.bodyWrapper}>
            <Sidebar />
            <main className={styles.main}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/today" element={<Today />} />
                <Route path="/project/:projectId" element={<ProjectTasks />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </TaskProvider>
    </ProjectProvider>
  );
}

function ReminderNotifications() {
  const { tasks } = useTaskContext();

  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!('Notification' in window)) return;
    const interval = setInterval(() => {
      const now = Date.now();
      tasks.forEach(task => {
        if (
          task.reminder &&
          !task._notified &&
          new Date(task.reminder).getTime() <= now &&
          Notification.permission === 'granted'
        ) {
          new Notification('Task Reminder', {
            body: task.title + (task.notes ? ('\n' + task.notes) : ''),
          });
          task._notified = true; // Prevent duplicate notifications in this session
        }
      });
    }, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [tasks]);

  return null;
}

function App() {
  // Detect dark mode from localStorage or document.body.dataset.theme
  const [mode, setMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || document.body.dataset.theme || 'light';
    }
    return 'light';
  });
  React.useEffect(() => {
    const handler = () => {
      const newMode = localStorage.getItem('theme') || document.body.dataset.theme || 'light';
      setMode(newMode);
    };
    window.addEventListener('storage', handler);
    const observer = new MutationObserver(handler);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      window.removeEventListener('storage', handler);
      observer.disconnect();
    };
  }, []);
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <TaskProvider>
            <ProjectProvider>
              <ReminderNotifications />
              <AppRoutes />
            </ProjectProvider>
          </TaskProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
