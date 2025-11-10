// Interface para comunicação com microserviços
class IGatewayRepository {
  async getProducts(token) {
    throw new Error('Method getProducts() not implemented');
  }

  async getOrders(token) {
    throw new Error('Method getOrders() not implemented');
  }

  async createOrder(orderData, token) {
    throw new Error('Method createOrder() not implemented');
  }

  async getDashboard(token) {
    throw new Error('Method getDashboard() not implemented');
  }
}

module.exports = IGatewayRepository;
