const asyncHandler = require('express-async-handler');
const Bin = require('../models/Bin');
const Rack = require('../models/Rack');

const getBins = asyncHandler(async (req, res) => {
    const bins = await Bin.find({}).populate('rack', 'name');
    res.json(bins);
});

const createBin = asyncHandler(async (req, res) => {
    const { name, rackId, description } = req.body;
    if (!name || !rackId) return res.status(400).json({ message: 'Name and Rack are required' });

    const rack = await Rack.findById(rackId);
    if (!rack) return res.status(404).json({ message: 'Rack not found' });

    const bin = await Bin.create({ name, rack: rackId, description });
    res.status(201).json({
        message: req.tokenStatus || 'Rack created successfully',
        bin
    });
});

module.exports = { getBins, createBin };
