const GetAllProductsUseCase = require('../../../application/use-cases/GetAllProducts.usecase');
const ProductRepository = require('../../../infrastructure/database/mongoose/ProductRepository');

class ListProductsFeature {
  constructor() {
    this.repository = new ProductRepository();
    this.useCase = new GetAllProductsUseCase(this.repository);
  }

  async handle(req, res) {
    try {
      const products = await this.useCase.execute();
      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ListProductsFeature;
