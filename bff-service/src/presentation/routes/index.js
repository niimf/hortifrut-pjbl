const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

// Features
const AuthFeature = require('../../features/auth');
const DashboardFeature = require('../../features/dashboard');
const ProductsFeature = require('../../features/products');
const OrdersFeature = require('../../features/orders');

// Instanciar features
const authFeature = new AuthFeature();
const dashboardFeature = new DashboardFeature();
const productsFeature = new ProductsFeature();
const ordersFeature = new OrdersFeature();

// Rotas públicas
router.post('/auth/login', (req, res) => authFeature.login(req, res));

// Rotas protegidas
router.get('/api/dashboard', authMiddleware, (req, res) => dashboardFeature.handle(req, res));
router.get('/api/products', authMiddleware, (req, res) => productsFeature.getAll(req, res));
router.get('/api/orders', authMiddleware, (req, res) => ordersFeature.getAll(req, res));
router.post('/api/orders', authMiddleware, (req, res) => ordersFeature.create(req, res));

module.exports = router;
