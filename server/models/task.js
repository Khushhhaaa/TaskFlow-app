const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { _id: false });

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  completed: { type: Boolean, default: false },
  dueDate: { type: String }, // ISO date string
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  labels: [{ type: String }],
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  subtasks: [subtaskSchema],
  notes: { type: String }, // Notes for the task
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 