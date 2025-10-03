const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'bins', required: true },
  quantity: { type: Number, required: true },
  reserved: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('inventorys', inventorySchema);
