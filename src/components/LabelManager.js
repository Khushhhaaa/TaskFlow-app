import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function randomColor() {
  const colors = ['#6C5CE7', '#00B894', '#00B0FF', '#FF7043', '#FFD600', '#FF5252', '#2ecc40', '#e67e22', '#8e44ad'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const LabelManager = () => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [color, setColor] = useState(randomColor());
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchLabels = async () => {
    setLoading(true);
    const res = await fetch('/api/labels', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    const data = await res.json();
    setLabels(data);
    setLoading(false);
  };

  useEffect(() => { fetchLabels(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    await fetch('/api/labels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ name, color })
    });
    setName('');
    setColor(randomColor());
    fetchLabels();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/labels/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchLabels();
  };

  const openEdit = (label) => {
    setEditId(label._id);
    setEditName(label.name);
    setEditColor(label.color);
    setDialogOpen(true);
  };

  const handleEdit = async () => {
    await fetch(`/api/labels/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ name: editName, color: editColor })
    });
    setDialogOpen(false);
    fetchLabels();
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>Manage Labels</Typography>
      <Box display="flex" gap={1} mb={2}>
        <TextField
          label="Label name"
          value={name}
          onChange={e => setName(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Color"
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
          size="small"
          sx={{ width: 60 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"></InputAdornment>
          }}
        />
        <Button onClick={handleAdd} variant="contained">Add</Button>
      </Box>
      <List>
        {loading ? <ListItem><ListItemText primary="Loading..." /></ListItem> : labels.length === 0 ? <ListItem><ListItemText primary="No labels yet." /></ListItem> : labels.map(label => (
          <ListItem key={label._id}>
            <Box sx={{ width: 18, height: 18, borderRadius: '50%', background: label.color, mr: 1, border: '1px solid #eee' }} />
            <ListItemText primary={label.name} />
            <ListItemSecondaryAction>
              <IconButton size="small" onClick={() => openEdit(label)}><EditIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => handleDelete(label._id)}><DeleteIcon fontSize="small" /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Label</DialogTitle>
        <DialogContent>
          <TextField
            label="Label name"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Color"
            type="color"
            value={editColor}
            onChange={e => setEditColor(e.target.value)}
            sx={{ width: 60 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LabelManager; 