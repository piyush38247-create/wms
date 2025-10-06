const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');

//Get all suppliers
//GET /api/suppliers
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find({});
  res.json(suppliers);
});

//Create a supplier
// POST /api/suppliers
const createSupplier = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const existing = await Supplier.findOne({ name });
  if (existing) return res.status(400).json({ message: 'Supplier already exists' });

  const supplier = await Supplier.create({ name, email, phone, address });
  res.status(201).json({
    message: 'Supplier created successfully',
    supplier
  });
});


const updateSupplier = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
    return res.status(404).json({ message: 'Supplier not found' });
  }

  supplier.name = name || supplier.name;
  supplier.email = email || supplier.email;
  supplier.phone = phone || supplier.phone;
  supplier.address = address || supplier.address;

  const updatedSupplier = await supplier.save();
  res.json({ message: 'Supplier updated successfully', supplier: updatedSupplier });
});


const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) {
    return res.status(404).json({ message: 'Supplier not found' });
  }

  await supplier.deleteOne();
  res.json({ message: 'Supplier deleted successfully' });
});


module.exports = { getSuppliers, createSupplier ,updateSupplier,deleteSupplier};
