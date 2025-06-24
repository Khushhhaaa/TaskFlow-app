import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await register(name, email, password);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={2} borderRadius={2}
      sx={{
        bgcolor: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#181a1b' : '#fff',
        color: (typeof window !== 'undefined' && document.body.dataset.theme === 'dark') ? '#fff' : '#222',
      }}
    >
      <Typography variant="h5" mb={2}>Sign Up</Typography>
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
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
      <Typography mt={2}>
        Already have an account? <Link to="/login">Sign In</Link>
      </Typography>
    </Box>
  );
};

export default Register; 