const asyncHandler = require('express-async-handler');
const Rack = require('../models/Rack');

//     Get all racks
//    GET /api/racks
const getRacks = asyncHandler(async (req, res) => {
  const racks = await Rack.find({});
  res.json({ message: 'Racks fetched successfully', racks });
});

//     Create a new rack
//   POST /api/racks
const createRack = asyncHandler(async (req, res) => {
  const { name, area } = req.body;

  if (!name || !area) {
    return res.status(400).json({ message: 'Name and Area are required' });
  }

  const existing = await Rack.findOne({ name });
  if (existing) return res.status(400).json({ message: 'Rack with this name already exists' });

  const rack = await Rack.create({ name, area });
  res.status(201).json({ message: 'Rack created successfully', rack });
});

//   Update a rack
//  PUT /api/racks/:id
const updateRack = asyncHandler(async (req, res) => {
  const { name, area } = req.body;
  const rack = await Rack.findById(req.params.id);
  if (!rack) return res.status(404).json({ message: 'Rack not found' });

  rack.name = name || rack.name;
  rack.area = area || rack.area;

  await rack.save();
  res.json({ message: 'Rack updated successfully', rack });
});

//    Delete a rack
//    DELETE /api/racks/:id
const deleteRack = asyncHandler(async (req, res) => {
  const rack = await Rack.findById(req.params.id);
  if (!rack) return res.status(404).json({ message: 'Rack not found' });

  await rack.deleteOne(); 
  res.json({ message: 'Rack deleted successfully' });
});

module.exports = { getRacks, createRack, updateRack, deleteRack };
