const mongoose = require('mongoose');

const salesOrderSchema = mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customers', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'bins', required: true },
  totalAmount: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'allocated', 'shipped','paid'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('salesorders', salesOrderSchema);
