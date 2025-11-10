const UpdateProductUseCase = require('../../../application/use-cases/UpdateProduct.usecase');
const ProductRepository = require('../../../infrastructure/database/mongoose/ProductRepository');

class UpdateProductFeature {
  constructor() {
    this.repository = new ProductRepository();
    this.useCase = new UpdateProductUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const product = await this.useCase.execute(req.params.id, req.body);
      res.status(200).json({
        success: true,
        data: product,
        message: 'Product updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UpdateProductFeature;
