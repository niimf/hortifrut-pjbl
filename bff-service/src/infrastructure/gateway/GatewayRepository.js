const axios = require('axios');
const IGatewayRepository = require('../../domain/repositories/IGatewayRepository');

class GatewayRepository extends IGatewayRepository {
  constructor() {
    super();
    this.productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
    this.orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';
  }

  async getProducts(token) {
    try {
      const response = await axios.get(`${this.productServiceUrl}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error.message);
      return [];
    }
  }

  async getOrders(token) {
    try {
      const response = await axios.get(`${this.orderServiceUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      return [];
    }
  }

  async createOrder(orderData, token) {
    try {
      const response = await axios.post(
        `${this.orderServiceUrl}/orders`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async getDashboard(token) {
    try {
      const [products, orders] = await Promise.all([
        this.getProducts(token),
        this.getOrders(token)
      ]);

      return {
        products,
        orders,
        summary: {
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard:', error.message);
      return { products: [], orders: [], summary: {} };
    }
  }
}

module.exports = GatewayRepository;
