const UpdateOrderUseCase = require('../../../application/use-cases/UpdateOrder.usecase');
const OrderRepository = require('../../../infrastructure/database/mssql/OrderRepository');

class UpdateOrderFeature {
  constructor() {
    this.repository = new OrderRepository();
    this.useCase = new UpdateOrderUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const order = await this.useCase.execute(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: order,
        message: 'Order updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UpdateOrderFeature;
