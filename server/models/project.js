const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#6C5CE7' },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 