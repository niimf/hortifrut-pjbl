class OrderController {
  constructor(
    createOrderUseCase,
    getAllOrdersUseCase,
    getOrderByIdUseCase,
    updateOrderUseCase,
    deleteOrderUseCase
  ) {
    this.createOrderUseCase = createOrderUseCase;
    this.getAllOrdersUseCase = getAllOrdersUseCase;
    this.getOrderByIdUseCase = getOrderByIdUseCase;
    this.updateOrderUseCase = updateOrderUseCase;
    this.deleteOrderUseCase = deleteOrderUseCase;
  }

  async create(req, res) {
    try {
      const order = await this.createOrderUseCase.execute(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const orders = await this.getAllOrdersUseCase.execute();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const order = await this.getOrderByIdUseCase.execute(req.params.id);
      res.status(200).json(order);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const order = await this.updateOrderUseCase.execute(
        req.params.id,
        req.body
      );
      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await this.deleteOrderUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = OrderController;
