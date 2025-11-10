class ProxyRequestUseCase {
  constructor(gatewayRepository) {
    this.gatewayRepository = gatewayRepository;
  }

  async getProducts(token) {
    return await this.gatewayRepository.getProducts(token);
  }

  async getOrders(token) {
    return await this.gatewayRepository.getOrders(token);
  }

  async createOrder(orderData, token) {
    return await this.gatewayRepository.createOrder(orderData, token);
  }
}

module.exports = ProxyRequestUseCase;
