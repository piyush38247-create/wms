const asyncHandler = require('express-async-handler');
const SalesOrder = require('../models/SalesOrder');
const Inventory = require('../models/Inventory');
const StockTransaction = require('../models/StockTransaction');
const Product = require('../models/Product');

const getSalesOrders = asyncHandler(async (req, res) => {
  const salesOrders = await SalesOrder.find({})
    .populate('customer', 'name email')
    .populate('bin', 'name');
  res.json(salesOrders);
});

const createSalesOrder = asyncHandler(async (req, res) => {
  const { customerId, products, binId, notes } = req.body;

  if (!customerId || !products || products.length === 0 || !binId) {
    return res.status(400).json({ message: 'Customer, Products and Bin are required' });
  }

  let totalAmount = 0;
  const populatedProducts = [];

  for (const p of products) {
    const prod = await Product.findById(p.product);
    if (!prod) return res.status(404).json({ message: `Product not found: ${p.product}` });

    const price = prod.price;
    const name = prod.name;
    totalAmount += price * p.quantity;

    populatedProducts.push({
      product: p.product,
      name,
      price,
      quantity: p.quantity,
    });
  }

  const salesOrder = await SalesOrder.create({
    customer: customerId,
    products: populatedProducts,
    bin: binId,
    totalAmount,
    notes,
    status: 'pending',
  });

  res.status(201).json({
    message: 'Sales Order created successfully',
    salesOrder,
  });
});

const updateSalesOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { customerId, products, binId, notes, status } = req.body;

  const salesOrder = await SalesOrder.findById(id);
  if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });

  if (customerId) salesOrder.customer = customerId;
  if (binId) salesOrder.bin = binId;
  if (notes) salesOrder.notes = notes;
  if (status) salesOrder.status = status;

  if (products && products.length > 0) {
    let totalAmount = 0;
    const updatedProducts = [];

    for (const p of products) {
      const prod = await Product.findById(p.product);
      if (!prod) return res.status(404).json({ message: `Product not found: ${p.product}` });

      const price = prod.price;
      const name = prod.name;
      totalAmount += price * p.quantity;

      updatedProducts.push({
        product: p.product,
        name,
        price,
        quantity: p.quantity,
      });
    }

    salesOrder.products = updatedProducts;
    salesOrder.totalAmount = totalAmount;
  }

  await salesOrder.save();

  res.json({
    message: 'Sales Order updated successfully',
    salesOrder,
  });
});

const deleteSalesOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const salesOrder = await SalesOrder.findById(id);

  if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });

  await salesOrder.deleteOne();

  res.json({ message: 'Sales Order deleted successfully', id });
});

const allocateSalesOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const salesOrder = await SalesOrder.findById(id);

  if (!salesOrder)
    return res.status(404).json({ message: 'Sales Order not found' });
  if (salesOrder.status !== 'pending')
    return res.status(400).json({ message: 'Sales Order already allocated or shipped' });

  for (const p of salesOrder.products) {
    const inventory = await Inventory.findOne({
      product: p.product,
      bin: salesOrder.bin,
    });

    if (!inventory || inventory.quantity < p.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${p.name}` });
    }

    inventory.quantity -= p.quantity;
    await inventory.save();

    await StockTransaction.create({
      product: p.product,
      bin: salesOrder.bin,
      type: 'allocate',
      quantity: p.quantity,
      reason: 'Sales Order Allocation',
    });
  }

  salesOrder.status = 'allocated';
  await salesOrder.save();

  res.json({
    message: 'Stock allocated successfully',
    salesOrder,
  });
});

module.exports = {
  getSalesOrders,
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  allocateSalesOrder,
};
