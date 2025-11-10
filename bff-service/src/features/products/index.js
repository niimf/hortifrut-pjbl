const ProxyRequestUseCase = require('../../application/use-cases/ProxyRequest.usecase');
const GatewayRepository = require('../../infrastructure/gateway/GatewayRepository');

class ProductsFeature {
  constructor() {
    this.gatewayRepository = new GatewayRepository();
    this.proxyUseCase = new ProxyRequestUseCase(this.gatewayRepository);
  }

  async getAll(req, res) {
    try {
      const products = await this.proxyUseCase.getProducts(req.token);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ProductsFeature;
