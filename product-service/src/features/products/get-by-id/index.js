const GetProductByIdUseCase = require('../../../application/use-cases/GetProductById.usecase');
const ProductRepository = require('../../../infrastructure/database/mongoose/ProductRepository');

class GetProductByIdFeature {
  constructor() {
    this.repository = new ProductRepository();
    this.useCase = new GetProductByIdUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const product = await this.useCase.execute(req.params.id);
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = GetProductByIdFeature;
