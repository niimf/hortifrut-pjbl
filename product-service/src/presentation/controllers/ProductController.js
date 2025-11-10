class ProductController {
  constructor(
    createProductUseCase,
    getAllProductsUseCase,
    getProductByIdUseCase,
    updateProductUseCase,
    deleteProductUseCase
  ) {
    this.createProductUseCase = createProductUseCase;
    this.getAllProductsUseCase = getAllProductsUseCase;
    this.getProductByIdUseCase = getProductByIdUseCase;
    this.updateProductUseCase = updateProductUseCase;
    this.deleteProductUseCase = deleteProductUseCase;
  }

  async create(req, res) {
    try {
      const product = await this.createProductUseCase.execute(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const products = await this.getAllProductsUseCase.execute();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const product = await this.getProductByIdUseCase.execute(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const product = await this.updateProductUseCase.execute(
        req.params.id,
        req.body
      );
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await this.deleteProductUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = ProductController;
