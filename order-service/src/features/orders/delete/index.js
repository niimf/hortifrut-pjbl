const DeleteOrderUseCase = require('../../../application/use-cases/DeleteOrder.usecase');
const OrderRepository = require('../../../infrastructure/database/mssql/OrderRepository');

class DeleteOrderFeature {
  constructor() {
    this.repository = new OrderRepository();
    this.useCase = new DeleteOrderUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const result = await this.useCase.execute(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = DeleteOrderFeature;
