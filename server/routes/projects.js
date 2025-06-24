const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const { auth } = require('./users');

// GET all projects
router.get('/', auth, async (req, res) => {
  const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(projects);
});

// POST add a new project
router.post('/', auth, async (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const newProject = new Project({ user: req.user.id, name, color });
  await newProject.save();
  res.status(201).json(newProject);
});

// PUT update a project
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const updated = await Project.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Project not found' });
  res.json(updated);
});

// DELETE a project
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const deleted = await Project.findOneAndDelete({ _id: id, user: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

module.exports = router; 