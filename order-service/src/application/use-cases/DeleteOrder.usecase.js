class DeleteOrderUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId) {
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    await this.orderRepository.delete(orderId);
    return { message: 'Order deleted successfully' };
  }
}

module.exports = DeleteOrderUseCase;
