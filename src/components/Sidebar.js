import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Inbox as InboxIcon,
  Today as TodayIcon,
  Folder as FolderIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ListAlt as ListAltIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import Logo from './Logo';
import { useProjectContext } from '../context/ProjectContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, addProject, updateProject, deleteProject } = useProjectContext();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', color: '#6C5CE7' });
  const [editProject, setEditProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <ListAltIcon /> },
    { path: '/inbox', label: 'Inbox', icon: <InboxIcon /> },
    { path: '/today', label: 'Today', icon: <TodayIcon /> },
    { path: '/calendar', label: 'Calendar', icon: <CalendarTodayIcon /> },
    { path: '/upcoming', label: 'Upcoming', icon: <CalendarTodayIcon /> },
    { path: '/projects', label: 'Projects', icon: <ListAltIcon /> }
  ];

  const handleAdd = async () => {
    if (newProject.name.trim()) {
      await addProject(newProject);
      setNewProject({ name: '', color: '#6C5CE7' });
      setIsAddOpen(false);
    }
  };

  const handleEdit = async () => {
    if (editProject && editProject.name.trim()) {
      await updateProject(editProject);
      setEditProject(null);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProject(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Drawer
      variant="permanent"
      className={styles.drawer}
      classes={{ paper: styles.drawerPaper }}
    >
      <Box className={styles.logoContainer}>
        <Logo />
      </Box>

      <List>
        {menuItems.map(({ path, label, icon }) => (
          <ListItem
            button
            key={path}
            onClick={() => navigate(path)}
            className={`${styles.menuItem} ${location.pathname === path ? styles.active : ''}`}
          >
            <ListItemIcon className={styles.menuIcon}>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>

      <Box className={styles.projectsSection}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" className={styles.projectsHeader}>
            Projects
          </Typography>
          <Tooltip title="Add Project">
            <IconButton size="small" onClick={() => setIsAddOpen(true)}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <List>
          {projects.map(project => (
            <ListItem
              button
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className={styles.menuItem}
              style={{ borderLeft: `4px solid ${project.color}` }}
            >
              <ListItemIcon className={styles.menuIcon}>
                <FolderIcon style={{ color: project.color }} />
              </ListItemIcon>
              <ListItemText primary={project.name} />
              <Tooltip title="Edit">
                <IconButton size="small" onClick={e => { e.stopPropagation(); setEditProject(project); }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={e => { e.stopPropagation(); setDeleteId(project._id); }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Add Project Dialog */}
      <Dialog open={isAddOpen} onClose={() => setIsAddOpen(false)}>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            value={newProject.name}
            onChange={e => setNewProject({ ...newProject, name: e.target.value })}
            fullWidth
            autoFocus
            margin="dense"
          />
          <TextField
            label="Color"
            type="color"
            value={newProject.color}
            onChange={e => setNewProject({ ...newProject, color: e.target.value })}
            fullWidth
            margin="dense"
            style={{ width: 60, marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!editProject} onClose={() => setEditProject(null)}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Project Name"
            value={editProject?.name || ''}
            onChange={e => setEditProject({ ...editProject, name: e.target.value })}
            fullWidth
            autoFocus
            margin="dense"
          />
          <TextField
            label="Color"
            type="color"
            value={editProject?.color || '#6C5CE7'}
            onChange={e => setEditProject({ ...editProject, color: e.target.value })}
            fullWidth
            margin="dense"
            style={{ width: 60, marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProject(null)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this project? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default Sidebar; 