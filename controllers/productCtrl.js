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

module.exports = { getProducts, createProduct };
