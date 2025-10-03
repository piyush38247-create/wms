const mongoose = require('mongoose');

const rackSchema = mongoose.Schema({
  name: { type: String, required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'areas', required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('racks', rackSchema);
