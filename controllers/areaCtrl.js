const asyncHandler = require('express-async-handler');
const Area = require('../models/Area');

const getAreas = asyncHandler(async (req, res) => {
  const areas = await Area.find({});
  res.json(areas);
});

const createArea = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const exists = await Area.findOne({ name });
  if (exists) return res.status(400).json({ message: 'Area already exists' });

  const area = await Area.create({ name, description });
  res.status(201).json(area);
});

module.exports = { getAreas, createArea };
