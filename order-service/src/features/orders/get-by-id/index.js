const GetOrderByIdUseCase = require('../../../application/use-cases/GetOrderById.usecase');
const OrderRepository = require('../../../infrastructure/database/mssql/OrderRepository');

class GetOrderByIdFeature {
  constructor() {
    this.repository = new OrderRepository();
    this.useCase = new GetOrderByIdUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const order = await this.useCase.execute(req.params.id);
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = GetOrderByIdFeature;
