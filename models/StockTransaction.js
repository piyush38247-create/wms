const mongoose = require('mongoose');

const stockTransactionSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'bins', required: true },
  type: {
    type: String,
    required: true,
    enum: ['receive', 'ship', 'adjust', 'allocate']  
  },
  quantity: { type: Number, required: true },
  reason: { type: String }
}, { timestamps: true });


module.exports = mongoose.model('stocktransactions', stockTransactionSchema);
