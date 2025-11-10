class IOrderRepository {
  async create(order) {
    throw new Error('Method create() not implemented');
  }

  async findAll() {
    throw new Error('Method findAll() not implemented');
  }

  async findById(id) {
    throw new Error('Method findById() not implemented');
  }

  async update(id, order) {
    throw new Error('Method update() not implemented');
  }

  async delete(id) {
    throw new Error('Method delete() not implemented');
  }
}

module.exports = IOrderRepository;
