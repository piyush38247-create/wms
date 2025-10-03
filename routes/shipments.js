const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getShipments, createShipment } = require('../controllers/shipmentsCtrl');

router.route('/')
  .get(protect, getShipments)
  .post(protect, createShipment);

module.exports = router;
