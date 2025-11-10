class GetOrderByIdUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId) {
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  }
}

module.exports = GetOrderByIdUseCase;
