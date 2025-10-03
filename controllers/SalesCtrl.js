// controllers/salesOrderController.js
const asyncHandler = require('express-async-handler');
const SalesOrder = require('../models/SalesOrder');
const Inventory = require('../models/Inventory');
const StockTransaction = require('../models/StockTransaction');

// GET Sales Orders
const getSalesOrders = asyncHandler(async (req, res) => {
  const salesOrders = await SalesOrder.find({})
    .populate('customer', 'name email')
    .populate('products.product', 'name sku')
    .populate('bin', 'name');
  res.json(salesOrders);
});

// Create Sales Order (only create, no stock deduction here)
const createSalesOrder = asyncHandler(async (req, res) => {
  const { customerId, products, binId, notes } = req.body;

  if (!customerId || !products || products.length === 0 || !binId) {
    return res.status(400).json({ message: 'Customer, Products and Bin are required' });
  }

  const totalAmount = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  const salesOrder = await SalesOrder.create({
    customer: customerId,
    products,
    bin: binId,
    totalAmount,
    notes,
    status: 'pending'
  });

  res.status(201).json({
    message: 'Sales Order created successfully (Pending)',
    salesOrder
  });
});

// Allocate Stock for Sales Order
const allocateSalesOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const salesOrder = await SalesOrder.findById(id);

  if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });
  if (salesOrder.status !== 'pending') return res.status(400).json({ message: 'Sales Order already allocated or shipped' });

  // Deduct inventory for each product
  for (const p of salesOrder.products) {
   const inventory = await Inventory.findOne({ product: p.product, bin: salesOrder.bin });
if (!inventory || inventory.quantity < p.quantity) {
  return res.status(400).json({ message: `Insufficient stock for product ${p.product}` });
}
    inventory.quantity -= p.quantity;
    await inventory.save();

    await StockTransaction.create({
      product: p.product,
      bin: salesOrder.bin,
      type: 'allocate',
      quantity: p.quantity,
      reason: 'Sales Order Allocation'
    });
  }

  salesOrder.status = 'allocated';
  await salesOrder.save();

  res.json({
    message: 'Stock allocated successfully',
    salesOrder
  });
});

module.exports = { getSalesOrders, createSalesOrder, allocateSalesOrder };
