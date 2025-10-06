const express = require('express');
const router = express.Router();
const {
  getStockLevels,
  updateStock,
  deleteStock,
  getSalesReport,
  updateSalesOrder,
  deleteSalesOrder
} = require('../controllers/reportController');

// Stock
router.get('/stock-levels', getStockLevels);
router.put('/stock-levels/:id', updateStock);
router.delete('/stock-levels/:id', deleteStock);

// Sales Orders
router.get('/sales', getSalesReport);
router.put('/sales/:id', updateSalesOrder);
router.delete('/sales/:id', deleteSalesOrder);

module.exports = router;
