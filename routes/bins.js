const express = require('express');
const router = express.Router();
const { getBins, createBin, updateBin, deleteBin } = require('../controllers/binCtrl');
const { protect } = require('../middleware/auth'); 

router.route('/')
  .get(protect, getBins)
  .post(protect, createBin);

router.route('/:id')
  .put(protect, updateBin)
  .delete(protect, deleteBin);

module.exports = router;

