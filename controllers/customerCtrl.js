const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');


const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({});
  res.json(customers);
});

const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const existing = await Customer.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Customer already exists with this email' });

  const customer = await Customer.create({ name, email, phone, address, wallet: 0 });
  res.status(201).json({
    message: 'Customer created successfully',
    customer
  });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  const customer = await Customer.findById(id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  customer.name = name || customer.name;
  customer.email = email || customer.email;
  customer.phone = phone || customer.phone;
  customer.address = address || customer.address;

  await customer.save();
  res.json({ message: 'Customer updated successfully', customer });
});

const updateWallet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const customer = await Customer.findById(id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  customer.wallet += amount; 
  await customer.save();

  res.json({ message: 'Wallet updated successfully', walletBalance: customer.wallet });
});


const deleteCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  await customer.deleteOne();
  res.json({ message: 'Customer deleted successfully', id });
});

module.exports = { getCustomers, createCustomer, updateWallet,deleteCustomer,updateCustomer };
