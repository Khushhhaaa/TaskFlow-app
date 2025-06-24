import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [serverCode, setServerCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await fetch(`${API_BASE_URL}/api/users/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setServerCode(data.code); // For demo, show code
      setStep(2);
      setSuccess('A reset code has been generated. (For demo: see below)');
    } else {
      const err = await res.json();
      setError(err.error || 'Failed to request reset code');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await fetch(`${API_BASE_URL}/api/users/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, password })
    });
    setLoading(false);
    if (res.ok) {
      setSuccess('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } else {
      const err = await res.json();
      setError(err.error || 'Failed to reset password');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={2} borderRadius={2} bgcolor="#fff">
      <Typography variant="h5" mb={2}>Reset Password</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {step === 1 ? (
        <form onSubmit={handleRequestCode}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Requesting...' : 'Request Reset Code'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleReset}>
          <TextField
            label="Reset Code"
            value={code}
            onChange={e => setCode(e.target.value)}
            fullWidth
            required
            margin="normal"
            helperText={serverCode ? `Demo code: ${serverCode}` : ''}
          />
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      )}
    </Box>
  );
};

export default ForgotPassword; 