const asyncHandler = require('express-async-handler');
const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

// @desc    Get all Purchase Orders
// @route   GET /api/purchase-orders
// @access  Private
const getPurchaseOrders = asyncHandler(async (req, res) => {
  const pos = await PurchaseOrder.find({})
    .populate('supplier', 'name email')
    .populate('products.product', 'name sku');
  res.json(pos);
});

// @desc    Create Purchase Order
// @route   POST /api/purchase-orders
// @access  Private
const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { supplierId, products, notes } = req.body;

  if (!supplierId || !products || products.length === 0) {
    return res.status(400).json({ message: 'Supplier and products are required' });
  }

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

  // validate products
  let totalAmount = 0;
  for (let item of products) {
    const prod = await Product.findById(item.product);
    if (!prod) return res.status(404).json({ message: `Product not found: ${item.product}` });
    totalAmount += item.price * item.quantity;
  }

  const po = await PurchaseOrder.create({
    supplier: supplierId,
    products,
    totalAmount,
    notes
  });

  const populatedPO = await PurchaseOrder.findById(po._id)
    .populate('supplier', 'name email')
    .populate('products.product', 'name sku');

  res.status(201).json({
    message: 'Purchase Order created successfully',
    purchaseOrder: populatedPO
  });
});

module.exports = { getPurchaseOrders, createPurchaseOrder };
