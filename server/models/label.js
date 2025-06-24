const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, required: true },
}, { timestamps: true });

const Label = mongoose.model('Label', labelSchema);

module.exports = Label; 