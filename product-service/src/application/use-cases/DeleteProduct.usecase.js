class DeleteProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId) {
    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    await this.productRepository.delete(productId);
    return { message: 'Product deleted successfully' };
  }
}

module.exports = DeleteProductUseCase;
