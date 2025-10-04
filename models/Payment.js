const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'salesorders' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['wallet', 'card', 'upi', 'netbanking'], default: 'wallet' },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed', 'refunded'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('payments', paymentSchema);
