const Product = require('../../domain/entities/Product.entity');

class UpdateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId, updateData) {
    // Busca o produto existente
    const existingProduct = await this.productRepository.findById(productId);
    
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Cria entidade atualizada (valida)
    const updatedProduct = new Product({
      id: productId,
      name: updateData.name || existingProduct.name,
      price: updateData.price || existingProduct.price,
      category: updateData.category || existingProduct.category,
      stock: updateData.stock !== undefined ? updateData.stock : existingProduct.stock
    });

    // Atualiza no repositório
    const result = await this.productRepository.update(productId, updatedProduct);
    return result;
  }
}

module.exports = UpdateProductUseCase;
