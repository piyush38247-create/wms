const asyncHandler = require('express-async-handler');
const PurchaseOrder = require('../models/PurchaseOrder');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');


const getPurchaseOrders = asyncHandler(async (req, res) => {
  const pos = await PurchaseOrder.find({})
    .populate('supplier', 'name email')
    .populate('products.product', 'name sku');
  res.json(pos);
});


const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { supplierId, products, notes } = req.body;

  if (!supplierId || !products || products.length === 0) {
    return res.status(400).json({ message: 'Supplier and products are required' });
  }

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

  let totalAmount = 0;
  const productList = [];

  for (let item of products) {
    const prod = await Product.findById(item.product);
    if (!prod) return res.status(404).json({ message: `Product not found: ${item.product}` });

    const quantity = item.quantity || 1;
    const price = prod.price; 

    totalAmount += price * quantity;

    productList.push({ product: item.product, quantity, price });
  }

  const po = await PurchaseOrder.create({
    supplier: supplierId,
    products: productList,
    totalAmount,
    notes
  });

  const populatedPO = await PurchaseOrder.findById(po._id)
    .populate('supplier', 'name email')
    .populate('products.product', 'name sku price');

  res.status(201).json({
    message: 'Purchase Order created successfully',
    purchaseOrder: populatedPO
  });
});


const updatePurchaseOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { supplierId, products, notes, status } = req.body;

  const purchaseOrder = await PurchaseOrder.findById(id);
  if (!purchaseOrder) return res.status(404).json({ message: 'Purchase Order not found' });

  if (supplierId) {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    purchaseOrder.supplier = supplierId;
  }

  if (products && products.length > 0) {
    let totalAmount = 0;
    const productList = [];

    for (let item of products) {
      const prod = await Product.findById(item.product);
      if (!prod) return res.status(404).json({ message: `Product not found: ${item.product}` });

      const quantity = item.quantity || 1;
      const price = prod.price; 
      totalAmount += price * quantity;
      productList.push({ product: item.product, quantity, price });
    }

    purchaseOrder.products = productList;
    purchaseOrder.totalAmount = totalAmount;
  }

  if (notes) purchaseOrder.notes = notes;
  if (status) purchaseOrder.status = status;

  await purchaseOrder.save();

  const updated = await PurchaseOrder.findById(id)
    .populate('supplier', 'name email')
    .populate('products.product', 'name sku price');

  res.json({
    message: 'Purchase Order updated successfully',
    purchaseOrder: updated
  });
});



const deletePurchaseOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const purchaseOrder = await PurchaseOrder.findById(id);
  if (!purchaseOrder) return res.status(404).json({ message: 'Purchase Order not found' });

  await purchaseOrder.deleteOne();

  res.json({
    message: 'Purchase Order deleted successfully',
    id
  });
});


module.exports = { getPurchaseOrders, createPurchaseOrder,deletePurchaseOrder ,updatePurchaseOrder};
