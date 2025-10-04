const express = require('express');
const router = express.Router();
const { getRacks, createRack, updateRack, deleteRack } = require('../controllers/rackCtrl');
const { protect } = require('../middleware/auth'); 

router.route('/')
  .get(protect, getRacks)
  .post(protect, createRack);

router.route('/:id')
  .put(protect, updateRack)
  .delete(protect, deleteRack);

module.exports = router;

