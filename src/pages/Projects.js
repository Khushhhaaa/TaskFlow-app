import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tooltip, Card } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Folder as FolderIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../context/ProjectContext';
import styles from './Inbox.module.css';

const Projects = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjectContext();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', color: '#6C5CE7' });
  const [editProject, setEditProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

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
    <Box sx={{
      background: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#111' : '#fff',
      color: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#fff' : '#2c3e50',
      borderRadius: 3,
      p: 3,
      mb: 3,
      boxShadow: 3,
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" className={styles.title}>Projects</Typography>
        <Button variant="contained" onClick={() => setIsAddOpen(true)}>Add Project</Button>
      </Box>
      <Box>
        {projects.length === 0 ? (
          <Typography color="textSecondary">No projects yet.</Typography>
        ) : (
          projects.map(project => (
            <Card
              key={project._id}
              sx={{
                background: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#181a1b' : '#fff',
                color: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#fff' : '#2c3e50',
                borderLeft: `6px solid ${project.color}`,
                mb: 2,
                boxShadow: 2,
              }}
            >
              <Box display="flex" alignItems="center" mb={2} p={2}>
                <FolderIcon style={{ color: project.color, marginRight: 12 }} />
                <Typography variant="subtitle1" style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/project/${project._id}`)}>
                  {project.name}
                </Typography>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => setEditProject(project)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => setDeleteId(project._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
          ))
        )}
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
    </Box>
  );
};

export default Projects; 