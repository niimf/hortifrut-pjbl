// Interface do repositório (contrato)
class IProductRepository {
  async create(product) {
    throw new Error('Method create() not implemented');
  }

  async findAll() {
    throw new Error('Method findAll() not implemented');
  }

  async findById(id) {
    throw new Error('Method findById() not implemented');
  }

  async update(id, product) {
    throw new Error('Method update() not implemented');
  }

  async delete(id) {
    throw new Error('Method delete() not implemented');
  }
}

// IMPORTANTE: Exportar como default
module.exports = IProductRepository;
