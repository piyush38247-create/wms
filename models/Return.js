const mongoose = require('mongoose');

const returnSchema = mongoose.Schema({
  salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'salesorders', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  quantity: { type: Number, required: true },
  reason: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processed'], 
    default: 'pending' 
  },
  processedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('returns', returnSchema);
