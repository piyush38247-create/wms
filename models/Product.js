const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0 },
  dimensions: { type: String },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('products', productSchema);
