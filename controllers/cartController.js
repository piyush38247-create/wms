const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalAmount: 0 });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1 });
  }

  cart.totalAmount = 0;
  for (const item of cart.items) {
    const prod = await Product.findById(item.product);
    cart.totalAmount += prod.price * item.quantity;
  }

  await cart.save();

  res.status(200).json({
    message: 'Product added to cart successfully',
    cart,
  });
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart) {
    return res.status(404).json({ message: 'Cart is empty' });
  }

  res.json(cart);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.totalAmount = 0;
  for (const item of cart.items) {
    const prod = await Product.findById(item.product);
    cart.totalAmount += prod.price * item.quantity;
  }

  await cart.save();

  res.json({ message: 'Item removed from cart', cart });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Cart cleared successfully' });
});




const updateCartQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) {
    return res.status(404).json({ message: 'Product not found in cart' });
  }

  item.quantity = quantity;

  cart.totalAmount = 0;
  for (const i of cart.items) {
    const prod = await Product.findById(i.product);
    cart.totalAmount += prod.price * i.quantity;
  }

  await cart.save();

  res.json({
    message: 'Cart quantity updated successfully',
    cart,
  });
});


module.exports = { addToCart, getCart, removeFromCart, clearCart ,updateCartQuantity};
