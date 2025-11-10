const GetAllOrdersUseCase = require('../../../application/use-cases/GetAllOrders.usecase');
const OrderRepository = require('../../../infrastructure/database/mssql/OrderRepository');

class ListOrdersFeature {
  constructor() {
    this.repository = new OrderRepository();
    this.useCase = new GetAllOrdersUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const orders = await this.useCase.execute();
      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ListOrdersFeature;
