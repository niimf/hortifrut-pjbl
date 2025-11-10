const ProxyRequestUseCase = require('../../application/use-cases/ProxyRequest.usecase');
const GatewayRepository = require('../../infrastructure/gateway/GatewayRepository');

class OrdersFeature {
  constructor() {
    this.gatewayRepository = new GatewayRepository();
    this.proxyUseCase = new ProxyRequestUseCase(this.gatewayRepository);
  }

  async getAll(req, res) {
    try {
      const orders = await this.proxyUseCase.getOrders(req.token);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const order = await this.proxyUseCase.createOrder(req.body, req.token);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = OrdersFeature;
