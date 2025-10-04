const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, price, quantity, dimensions, description } = req.body;
  if (!name || !sku || !price) return res.status(400).json({ message: 'Name, SKU and Price are required' });

  const exists = await Product.findOne({ sku });
  if (exists) return res.status(400).json({ message: 'Product SKU already exists' });

  const product = await Product.create({ name, sku, price, quantity, dimensions, description });
  res.status(201).json({
    message: req.tokenStatus || 'Product created successfully',
    product
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, sku, price, dimensions, quantity, description } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  product.name = name || product.name;
  product.sku = sku || product.sku;
  product.price = price || product.price;
  product.dimensions = dimensions || product.dimensions;
  product.quantity = quantity ?? product.quantity;
  product.description = description || product.description;

  await product.save();
  res.json({ message: 'Product updated successfully', product });
});

//   Delete product
//   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  await product.deleteOne();
  res.json({ message: 'Product deleted successfully' });
});

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
