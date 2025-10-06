const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getShipments, createShipment, updateShipment, deleteShipment, } = require('../controllers/shipmentsCtrl');

router.route('/')
  .get(protect, getShipments)
  .post(protect, createShipment);

  router.route('/:id')
  .put(protect,updateShipment )
  .delete(protect, deleteShipment);

module.exports = router;
