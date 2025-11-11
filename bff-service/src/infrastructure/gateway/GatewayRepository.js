const axios = require('axios');
const IGatewayRepository = require('../../domain/repositories/IGatewayRepository');

class GatewayRepository extends IGatewayRepository {
  constructor() {
    super();
    this.productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
    this.orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:3002';
    this.azureFunctionUrl = process.env.AZURE_FUNCTION_URL || 'http://127.0.0.1:7071';
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
      // Verificar status da Azure Function
      let functionStatus = { ok: false, message: 'unavailable' };
      try {
        const azureResponse = await axios.get(`${this.azureFunctionUrl}/api/OrderCreatedHandler`, {
          timeout: 2000,
          validateStatus: () => true // Aceita qualquer status
        });
        functionStatus = {
          ok: azureResponse.status >= 200 && azureResponse.status < 500, // Qualquer resposta válida (2xx, 3xx, 4xx)
          message: 'available'
        };
      } catch (azureError) {
        console.log('Azure Function unavailable:', azureError.message);
        functionStatus = { ok: false, message: 'unavailable' };
      }

      // Buscar produtos e pedidos
      const [products, orders] = await Promise.all([
        this.getProducts(token),
        this.getOrders(token)
      ]);

      return {
        products,
        orders,
        functionStatus,
        summary: {
          totalProducts: Array.isArray(products) ? products.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard:', error.message);
      return {
        products: [],
        orders: [],
        functionStatus: { ok: false, message: 'unavailable' },
        summary: {}
      };
    }
  }
}

module.exports = GatewayRepository;
