const asyncHandler = require('express-async-handler');
const Return = require('../models/Return');
const Inventory = require('../models/Inventory');
const StockTransaction = require('../models/StockTransaction');
const SalesOrder = require('../models/SalesOrder');

const createReturn = asyncHandler(async (req, res) => {
  const { salesOrderId, productId, quantity, reason, binId } = req.body;

  if (!salesOrderId || !productId || !quantity || !binId) {
    return res.status(400).json({ message: 'Sales Order, Product, Quantity and Bin are required' });
  }

  const salesOrder = await SalesOrder.findById(salesOrderId);
  if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });

  let inventory = await Inventory.findOne({ product: productId, bin: binId });
  if (!inventory) {
    inventory = await Inventory.create({ product: productId, bin: binId, quantity, reserved: 0 });
  } else {
    inventory.quantity += quantity;
  }
  await inventory.save();

  await StockTransaction.create({
    product: productId,
    bin: binId,
    type: 'adjust',
    quantity,
    reason: reason || 'Product Return'
  });

  const returned = await Return.create({
    salesOrder: salesOrderId,
    product: productId,
    quantity,
    reason,
    status: 'processed',
    processedAt: new Date()
  });

  res.status(201).json({ message: 'Return processed successfully', returned });
});

const getReturns = asyncHandler(async (req, res) => {
  const returns = await Return.find({})
    .populate('salesOrder', 'customer status totalAmount')
    .populate('product', 'name sku');
  res.json({
    message: 'Returns fetched successfully',
    returns
  });
});

const updateReturn = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, reason, status } = req.body;

  const returned = await Return.findById(id);
  if (!returned) return res.status(404).json({ message: 'Return not found' });

  if (quantity && quantity !== returned.quantity) {
    const inventory = await Inventory.findOne({ product: returned.product, bin: returned.bin });
    if (inventory) {
      inventory.quantity += quantity - returned.quantity;
      await inventory.save();
    }
    returned.quantity = quantity;
  }

  if (reason) returned.reason = reason;
  if (status) returned.status = status;

  await returned.save();
  res.json({ message: 'Return updated successfully', returned });
});


const deleteReturn = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const returned = await Return.findById(id);
  if (!returned) return res.status(404).json({ message: 'Return not found' });

  const inventory = await Inventory.findOne({ product: returned.product, bin: returned.bin });
  if (inventory) {
    inventory.quantity -= returned.quantity;
    await inventory.save();
  }

  await returned.deleteOne();
  res.json({ message: 'Return deleted successfully', id });
});

module.exports = { createReturn, getReturns, updateReturn, deleteReturn };
