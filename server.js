require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const auth = require('./routes/auth')
const areas = require('./routes/areas')
const rackRoutes = require('./routes/racks');
const binRoutes = require('./routes/bins');
const productRoutes = require('./routes/products');
const inventoryRoutes = require('./routes/inventory');
const purchaseOrders = require('./routes/purchaseOrders');
const supplierRoutes = require('./routes/suppliers');
const customerRoutes = require('./routes/customers');
const salesOrderRoutes = require('./routes/salesOrders');
const shipmentsRoutes = require('./routes/shipments')
const returnsRoutes = require('./routes/returns')
connectDB();

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api/auth', auth);
app.use('/api/areas', areas);
app.use('/api/racks', rackRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchase-orders', purchaseOrders);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/shipments', shipmentsRoutes);
app.use('/api/returns',returnsRoutes)

// quick health route
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
