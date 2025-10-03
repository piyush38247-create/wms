const asyncHandler = require('express-async-handler');
const Rack = require('../models/Rack');
const Area = require('../models/Area');

const getRacks = asyncHandler(async (req, res) => {
  const racks = await Rack.find({}).populate('area', 'name');
  res.json(racks);
});

const createRack = asyncHandler(async (req, res) => {
  const { name, areaId, description } = req.body;
  if (!name || !areaId) return res.status(400).json({ message: 'Name and Area are required' });

  const area = await Area.findById(areaId);
  if (!area) return res.status(404).json({ message: 'Area not found' });

  const rack = await Rack.create({ name, area: areaId, description });
  res.status(201).json({
    message: req.tokenStatus || 'Rack created successfully',
    rack
  });
});

module.exports = { getRacks, createRack };
