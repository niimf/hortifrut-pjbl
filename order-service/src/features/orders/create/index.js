const CreateOrderUseCase = require('../../../application/use-cases/CreateOrder.usecase');
const OrderRepository = require('../../../infrastructure/database/mssql/OrderRepository');

class CreateOrderFeature {
  constructor() {
    this.repository = new OrderRepository();
    this.useCase = new CreateOrderUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const order = await this.useCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: order,
        message: 'Order created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CreateOrderFeature;
