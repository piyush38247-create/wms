const mongoose = require('mongoose');

const purchaseOrderSchema = mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'suppliers', required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'received', 'cancelled'],
    default: 'pending'
  },
  totalAmount: { type: Number, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('purchase_orders', purchaseOrderSchema);
