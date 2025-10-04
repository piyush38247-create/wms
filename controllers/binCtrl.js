const asyncHandler = require('express-async-handler');
const Bin = require('../models/Bin');

//    Get all bins
//   GET /api/bins
const getBins = asyncHandler(async (req, res) => {
    const bins = await Bin.find({}).populate('rack', 'name area');
    res.json({ message: 'Bins fetched successfully', bins });
});

//    Create a new bin
//    POST /api/bins
const createBin = asyncHandler(async (req, res) => {
    const { name, rack } = req.body;

    if (!name || !rack) {
        return res.status(400).json({ message: 'Name and Rack are required' });
    }

    const existing = await Bin.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Bin with this name already exists' });

    const bin = await Bin.create({ name, rack });
    res.status(201).json({ message: 'Bin created successfully', bin });
});

//     Update a bin
//   PUT /api/bins/:id
const updateBin = asyncHandler(async (req, res) => {
    const { name, rack } = req.body;
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ message: 'Bin not found' });

    bin.name = name || bin.name;
    bin.rack = rack || bin.rack;

    await bin.save();
    res.json({ message: 'Bin updated successfully', bin });
});

//     Delete a bin
//   DELETE /api/bins/:id
const deleteBin = asyncHandler(async (req, res) => {
    const bin = await Bin.findById(req.params.id);
    if (!bin) return res.status(404).json({ message: 'Bin not found' });

    await bin.deleteOne();
    res.json({ message: 'Bin deleted successfully' });
});

module.exports = { getBins, createBin, updateBin, deleteBin };
