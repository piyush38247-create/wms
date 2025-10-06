const asyncHandler = require('express-async-handler');
const Shipment = require('../models/Shipment');
const SalesOrder = require('../models/SalesOrder');


const getShipments = asyncHandler(async (req, res) => {
  const shipments = await Shipment.find({})
    .populate('salesOrder', 'customer totalAmount status')
    .sort({ shippedDate: -1 });
  res.json(shipments);
});


const createShipment = asyncHandler(async (req, res) => {
  const { salesOrderId, carrier, trackingNumber, status, notes } = req.body;

  if (!salesOrderId || !carrier) {
    return res.status(400).json({ message: 'Sales Order and Carrier are required' });
  }

  const salesOrder = await SalesOrder.findById(salesOrderId);
  if (!salesOrder) return res.status(404).json({ message: 'Sales Order not found' });

  if (salesOrder.status !== 'allocated') {
    return res.status(400).json({ message: 'Sales Order must be allocated before shipping' });
  }

  const shipment = await Shipment.create({
    salesOrder: salesOrderId,
    carrier,
    trackingNumber,
    status: status || 'pending',
    notes,
  });

  salesOrder.status = 'shipped';
  await salesOrder.save();

  res.status(201).json({ message: 'Shipment created successfully', shipment });
});

const updateShipment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { carrier, trackingNumber, status, notes } = req.body;

  const shipment = await Shipment.findById(id);
  if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

  if (carrier) shipment.carrier = carrier;
  if (trackingNumber) shipment.trackingNumber = trackingNumber;
  if (status) shipment.status = status;
  if (notes) shipment.notes = notes;

  const updatedShipment = await shipment.save();
  res.json({ message: 'Shipment updated successfully', shipment: updatedShipment });
});


const deleteShipment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const shipment = await Shipment.findById(id);
  if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

  await shipment.deleteOne();
  res.json({ message: 'Shipment deleted successfully' });
});

module.exports = {
  getShipments,
  createShipment,
  updateShipment,
  deleteShipment,
};
