const asyncHandler = require('express-async-handler');
const Inventory = require('../models/Inventory');
const product = require('../models/Product');
const bin = require('../models/Bin');
const StockTransaction = require('../models/StockTransaction');

// Get stock levels
// GET /api/inventory
const getInventory = asyncHandler(async (req, res) => {
  const inventory = await Inventory.find({})
    .populate('product', 'name sku')
    .populate('bin', 'name');
  res.json(inventory);
});




//  Receive stock (from PO)
//  POST /api/inventory/receive
const receiveStock = asyncHandler(async (req, res) => {
  const { productId, binId, quantity } = req.body;
  if (!productId || !binId || !quantity) {
    return res.status(400).json({ message: 'Product, Bin, and Quantity required' });
  }

  let inventory = await Inventory.findOne({ product: productId, bin: binId });
  if (inventory) {
    inventory.quantity += quantity;
  } else {
    inventory = await Inventory.create({
      product: productId,
      bin: binId,
      quantity,
      reserved: 0,
    });
  }
  await inventory.save();

  await StockTransaction.create({
    product: productId,
    bin: binId,
    type: 'receive',
    quantity
  });

  const populatedInventory = await Inventory.findById(inventory._id)
    .populate('product', 'name sku')
    .populate('bin', 'name');

  res.json({ message: 'Stock received successfully', inventory: populatedInventory });
});


//    Ship stock (for SO)
//    POST /api/inventory/ship
const shipStock = asyncHandler(async (req, res) => {
  const { productId, binId, quantity } = req.body;
  if (!productId || !binId || !quantity) {
    return res.status(400).json({ message: 'Product, Bin, and Quantity required' });
  }

  const inventory = await Inventory.findOne({ product: productId, bin: binId });
  if (!inventory || inventory.quantity < quantity) {
    return res.status(400).json({ message: 'Insufficient stock to ship' });
  }

  inventory.quantity -= quantity;
  await inventory.save();

  await StockTransaction.create({
    product: productId,
    bin: binId,
    type: 'ship',
    quantity
  });

  const populatedInventory = await Inventory.findById(inventory._id)
    .populate('product', 'name sku')
    .populate('bin', 'name');

  res.json({ message: 'Stock shipped successfully', inventory: populatedInventory });
});


//   Manual stock adjustment
//   POST /api/inventory/adjust
const adjustStock = asyncHandler(async (req, res) => {
  const { productId, binId, quantity, reason } = req.body;
  if (!productId || !binId || !quantity || !reason) {
    return res.status(400).json({ message: 'Product, Bin, Quantity and Reason required' });
  }

  let inventory = await Inventory.findOne({ product: productId, bin: binId });
  if (!inventory) {
    inventory = await Inventory.create({
      product: productId,
      bin: binId,
      quantity,
      reserved: 0
    });
  } else {
    inventory.quantity += quantity; // +ve or -ve adjustment
  }
  await inventory.save();

  await StockTransaction.create({
    product: productId,
    bin: binId,
    type: 'adjust',
    quantity,
    reason
  });

  const populatedInventory = await Inventory.findById(inventory._id)
    .populate('product', 'name sku')
    .populate('bin', 'name');

  res.json({ message: 'Stock adjusted successfully', inventory: populatedInventory });
});

module.exports = { getInventory, receiveStock, shipStock, adjustStock };
