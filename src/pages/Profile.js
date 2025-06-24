import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Alert, Avatar, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const AVATAR_KEY = 'userAvatar';

const Profile = () => {
  const { user, token, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem(AVATAR_KEY) || '');
  const fileInputRef = useRef();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
      localStorage.setItem(AVATAR_KEY, ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await fetch('/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, email, password: password || undefined })
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setUser && setUser(data);
      setSuccess('Profile updated!');
      setPassword('');
    } else {
      const err = await res.json();
      setError(err.error || 'Update failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={2} borderRadius={2} bgcolor="#fff">
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar src={avatar} sx={{ width: 80, height: 80, mb: 1 }} />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleAvatarChange}
        />
        <IconButton color="primary" component="span" onClick={() => fileInputRef.current.click()}>
          <PhotoCamera />
        </IconButton>
      </Box>
      <Typography variant="h5" mb={2}>Edit Profile</Typography>
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          helperText="Leave blank to keep current password"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Box>
  );
};

export default Profile;