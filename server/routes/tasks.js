const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const dayjs = require('dayjs');
const { auth } = require('./users');

// GET all tasks, with optional filters
router.get('/', auth, async (req, res) => {
  const { projectId, today, inbox } = req.query;
  let filter = { user: req.user.id };
  if (projectId) filter.projectId = projectId;
  if (today) {
    const todayStr = dayjs().format('YYYY-MM-DD');
    filter.dueDate = todayStr;
  }
  if (inbox) filter.projectId = null;
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json(tasks);
});

// GET reminders (tasks due today, tomorrow, or overdue)
router.get('/reminders', auth, async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const reminders = await Task.find({
    user: req.user.id,
    dueDate: { $exists: true, $ne: "" },
    $or: [
      { dueDate: today },
      { dueDate: tomorrow },
      { dueDate: { $lt: today } },
    ],
  }).sort({ dueDate: 1 });
  res.json(reminders);
});

// POST add a new task
router.post('/', auth, async (req, res) => {
  const { title, notes, status, dueDate, projectId, labels, priority, subtasks } = req.body;
  if (!title || !status) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const newTask = new Task({
    user: req.user.id,
    title,
    notes,
    status,
    dueDate,
    projectId,
    labels,
    priority,
    subtasks
  });
  await newTask.save();
  res.status(201).json(newTask);
});

// PUT update a task
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const updated = await Task.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

// DELETE a task
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const deleted = await Task.findOneAndDelete({ _id: id, user: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Task not found' });
  res.json({ success: true });
});

module.exports = router; 