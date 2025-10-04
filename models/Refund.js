const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  amount: { type: Number, required: true },
  reason: { type: String },
  status: { type: String, enum: ['processed', 'pending', 'failed'], default: 'processed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Refund', refundSchema);
