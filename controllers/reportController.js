const asyncHandler = require('express-async-handler');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const Bin = require('../models/Bin');
const SalesOrder = require('../models/SalesOrder');
// GET /api/reports/stock-levels
const getStockLevels = asyncHandler(async (req, res) => {
  // Fetch all inventory with product & bin details
  const stockLevels = await Inventory.find({})
    .populate('product', 'name sku price')
    .populate('bin', 'name');

  // Format response
  const report = stockLevels.map(item => ({
    productId: item.product._id,
    productName: item.product.name,
    sku: item.product.sku,
    binId: item.bin._id,
    binName: item.bin.name,
    quantity: item.quantity,
    reserved: item.reserved
  }));

  res.json({
    message: 'Stock level report fetched successfully',
    report
  });
});


const getSalesReport = asyncHandler(async (req, res) => {
  const salesOrders = await SalesOrder.find({})
    .populate('customer', 'name email')
    .populate('products.product', 'name sku')
    .populate('bin', 'name');

  const report = salesOrders.map(order => ({
    orderId: order._id,
    customer: order.customer,
    bin: order.bin,
    status: order.status,
    totalAmount: order.totalAmount,
    products: order.products.map(p => ({
      productId: p.product._id,
      name: p.product.name,
      sku: p.product.sku,
      quantity: p.quantity,
      price: p.price,
      subtotal: p.quantity * p.price
    })),
    createdAt: order.createdAt
  }));

  res.json({
    message: 'Sales report fetched successfully',
    report
  });
});


module.exports = { getStockLevels ,getSalesReport};
