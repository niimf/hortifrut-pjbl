const DeleteProductUseCase = require('../../../application/use-cases/DeleteProduct.usecase');
const ProductRepository = require('../../../infrastructure/database/mongoose/ProductRepository');

class DeleteProductFeature {
  constructor() {
    this.repository = new ProductRepository();
    this.useCase = new DeleteProductUseCase(this.repository);
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

module.exports = DeleteProductFeature;
