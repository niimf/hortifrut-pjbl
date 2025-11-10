class GetAllOrdersUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute() {
    const orders = await this.orderRepository.findAll();
    return orders;
  }
}

module.exports = GetAllOrdersUseCase;
