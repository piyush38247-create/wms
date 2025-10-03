const mongoose = require('mongoose');

const binSchema = mongoose.Schema({
  name: { type: String, required: true },
  rack: { type: mongoose.Schema.Types.ObjectId, ref: 'racks', required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('bins', binSchema);
