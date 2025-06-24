const express = require('express');
const router = express.Router();
const Label = require('../models/label');
const { auth } = require('./users');

// Get all labels for the user
router.get('/', auth, async (req, res) => {
  const labels = await Label.find({ user: req.user._id });
  res.json(labels);
});

// Create a new label
router.post('/', auth, async (req, res) => {
  const { name, color } = req.body;
  if (!name || !color) return res.status(400).json({ error: 'Name and color are required' });
  const label = new Label({ user: req.user._id, name, color });
  await label.save();
  res.status(201).json(label);
});

// Update a label
router.put('/:id', auth, async (req, res) => {
  const { name, color } = req.body;
  const label = await Label.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { name, color },
    { new: true }
  );
  if (!label) return res.status(404).json({ error: 'Label not found' });
  res.json(label);
});

// Delete a label
router.delete('/:id', auth, async (req, res) => {
  const label = await Label.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!label) return res.status(404).json({ error: 'Label not found' });
  res.json({ success: true });
});

module.exports = router; 