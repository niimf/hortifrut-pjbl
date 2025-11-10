require('dotenv').config();

const express = require('express');
const cors = require('cors');

const routes = require('./presentation/routes');
const errorHandler = require('./presentation/middlewares/errorHandler');

const PORT = process.env.PORT || 4000;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'bff-service',
    timestamp: new Date().toISOString()
  });
});

// Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 BFF Service running on port ${PORT}`);
  console.log(`📊 Clean Architecture + API Gateway implemented`);
});
