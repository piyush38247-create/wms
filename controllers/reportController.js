const asyncHandler = require('express-async-handler');
const Inventory = require('../models/Inventory');
const SalesOrder = require('../models/SalesOrder');
const Product = require('../models/Product');
const Bin = require('../models/Bin');


const getStockLevels = asyncHandler(async (req, res) => {
  const stockLevels = await Inventory.find({})
    .populate('product', 'name sku price')
    .populate('bin', 'name');

  const report = stockLevels.map(item => ({
    stockId: item._id,
    productId: item.product?._id || null,
    productName: item.product?.name || 'Unknown Product',
    sku: item.product?.sku || 'N/A',
    binId: item.bin?._id || null,
    binName: item.bin?.name || 'Unknown Bin',
    quantity: item.quantity,
    reserved: item.reserved
  }));

  res.json({
    message: 'Stock level report fetched successfully',
    report
  });
});

const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, reserved, binId } = req.body;

  const stock = await Inventory.findById(id);
  if (!stock) return res.status(404).json({ message: 'Stock item not found' });

  if (quantity !== undefined) stock.quantity = quantity;
  if (reserved !== undefined) stock.reserved = reserved;
  if (binId) stock.bin = binId;

  await stock.save();

  res.json({ message: 'Stock updated successfully', stock });
});

const deleteStock = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const stock = await Inventory.findById(id);
  if (!stock) return res.status(404).json({ message: 'Stock item not found' });

  await stock.deleteOne();
  res.json({ message: 'Stock deleted successfully', id });
});


// ===== SALES ORDER CRUD =====

const getSalesReport = asyncHandler(async (req, res) => {
  const salesOrders = await SalesOrder.find({})
    .populate('customer', 'name email')
    .populate('products.product', 'name sku price')
    .populate('bin', 'name');

  const report = salesOrders.map(order => ({
    orderId: order._id,
    customer: order.customer || null,
    bin: order.bin || null,
    status: order.status,
    totalAmount: order.totalAmount,
    products: order.products.map(p => ({
      productId: p.product?._id || null,
      name: p.product?.name || p.name || 'Unknown Product',
      sku: p.product?.sku || 'N/A',
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

const updateSalesOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { products, status, binId } = req.body;

  const order = await SalesOrder.findById(id);
  if (!order) return res.status(404).json({ message: 'Sales order not found' });

  if (products) {
    let totalAmount = 0;
    const updatedProducts = [];

    for (const p of products) {
      const prod = await Product.findById(p.product);
      if (!prod) return res.status(404).json({ message: `Product not found: ${p.product}` });

      totalAmount += prod.price * p.quantity;
      updatedProducts.push({
        product: p.product,
        name: prod.name,
        price: prod.price,
        quantity: p.quantity
      });
    }
    order.products = updatedProducts;
    order.totalAmount = totalAmount;
  }

  if (status) order.status = status;
  if (binId) order.bin = binId;

  await order.save();
  res.json({ message: 'Sales order updated successfully', order });
});

const deleteSalesOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await SalesOrder.findById(id);
  if (!order) return res.status(404).json({ message: 'Sales order not found' });

  await order.deleteOne();
  res.json({ message: 'Sales order deleted successfully', id });
});

module.exports = {
  getStockLevels,
  updateStock,
  deleteStock,
  getSalesReport,
  updateSalesOrder,
  deleteSalesOrder
};
