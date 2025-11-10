const Product = require('../../domain/entities/Product.entity');

class CreateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productData) {
    // Cria a entidade de domínio (valida automaticamente)
    const product = new Product({
      name: productData.name,
      price: productData.price,
      category: productData.category,
      stock: productData.stock || 0
    });

    // Persiste usando o repositório
    const savedProduct = await this.productRepository.create(product);
    return savedProduct;
  }
}

module.exports = CreateProductUseCase;
