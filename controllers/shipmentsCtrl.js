const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const SalesOrder = require('../models/SalesOrder');

//  Get all shipments
//   GET /api/shipments
const getShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({})
    .populate('salesOrder', 'customer totalAmount status')
    .sort({ shippedDate: -1 });
  res.json(shipments);
});

//   Create shipment for a sales order
//   POST /api/shipments
const createShipment = asyncHandler(async (req, res) => {
  const { salesOrderId, carrier, trackingNumber, status, notes } = req.body;

  if (!salesOrderId || !carrier) {
    return res.status(400).json({ message: 'Sales Order and Carrier are required' });
  }

  const salesOrder = await SalesOrder.findById(salesOrderId);
  if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });

  // Optional: check if already allocated
  if (salesOrder.status !== 'allocated') {
    return res.status(400).json({ message: 'Sales Order must be allocated before shipping' });
  }

  const shipment = await Shipment.create({
    salesOrder: salesOrderId,
    carrier,
    trackingNumber,
    status: status || 'pending',
    notes
  });

  // Update sales order status to shipped
  salesOrder.status = 'shipped';
  await salesOrder.save();

  res.status(201).json({ message: 'Shipment created successfully', shipment });
});

module.exports = { getShipments, createShipment };
