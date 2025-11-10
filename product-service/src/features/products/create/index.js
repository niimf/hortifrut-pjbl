const CreateProductUseCase = require('../../../application/use-cases/CreateProduct.usecase');
const ProductRepository = require('../../../infrastructure/database/mongoose/ProductRepository');

// Feature completa: tudo relacionado a criar produto
class CreateProductFeature {
  constructor() {
    this.repository = new ProductRepository();
    this.useCase = new CreateProductUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const product = await this.useCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CreateProductFeature;
