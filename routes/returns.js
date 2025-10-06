const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReturn, getReturns ,updateReturn,deleteReturn} = require('../controllers/returnsCtrl');

router.route('/').post(protect, createReturn);
 router.route('/').get(protect, getReturns);

 router.route('/:id')
  .put(protect, updateReturn)
  .delete(protect, deleteReturn);
module.exports = router;
