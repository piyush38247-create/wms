const asyncHandler = require('express-async-handler');
const Area = require('../models/Area');

// GET /api/areas - List all areas
const getAreas = asyncHandler(async (req, res) => {
  const areas = await Area.find({});
  res.json({
    message: 'Areas fetched successfully',
    areas
  });
});

// POST /api/areas - Create a new area
const createArea = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Area name is required');
  }

  const existing = await Area.findOne({ name });
  if (existing) {
    res.status(400);
    throw new Error('Area with this name already exists');
  }

  const area = await Area.create({ name, description });
  res.status(201).json({
    message: 'Area created successfully',
    area
  });
});

// PUT /api/areas/:id - Update area
const updateArea = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const area = await Area.findById(id);
  if (!area) {
    res.status(404);
    throw new Error('Area not found');
  }

  if (name) area.name = name;
  if (description) area.description = description;

  await area.save();

  res.json({
    message: 'Area updated successfully',
    area
  });
});

// DELETE /api/areas/:id - Delete area
const deleteArea = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const area = await Area.findById(id);
  if (!area) {
    res.status(404);
    throw new Error('Area not found');
  }

  await area.deleteOne();  

  res.json({
    message: 'Area deleted successfully'
  });
});

module.exports = {
  getAreas,
  createArea,
  updateArea,
  deleteArea
};
