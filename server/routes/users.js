const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET = process.env.JWT_SECRET || 'changeme';
const crypto = require('crypto');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });
    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Middleware to protect routes
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Example protected route
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Update profile
router.put('/me', auth, async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  await user.save();
  res.json({ id: user._id, name: user.name, email: user.email });
});

// Forgot password (request reset code)
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'No user with that email' });
  const code = crypto.randomBytes(3).toString('hex').toUpperCase();
  user.resetCode = code;
  user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  await user.save();
  // In production, send code via email. For demo, return it in response.
  res.json({ message: 'Reset code generated', code });
});

// Reset password
router.post('/reset', async (req, res) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) return res.status(400).json({ error: 'All fields required' });
  const user = await User.findOne({ email, resetCode: code, resetCodeExpires: { $gt: new Date() } });
  if (!user) return res.status(400).json({ error: 'Invalid or expired code' });
  user.password = password;
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

module.exports = router;
module.exports.auth = auth;