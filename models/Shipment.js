const mongoose = require('mongoose');

const shipmentSchema = mongoose.Schema({
  salesOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'salesorders', required: true },
  shippedDate: { type: Date, default: Date.now },
  carrier: { type: String, required: true },
  trackingNumber: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered'], 
    default: 'pending' 
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('shipments', shipmentSchema);
