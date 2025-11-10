const Order = require('../../domain/entities/Order.entity');

class CreateOrderUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderData) {
    const order = new Order({
      customerName: orderData.customerName,
      total: orderData.total,
      status: orderData.status || 'pending'
    });

    const savedOrder = await this.orderRepository.create(order);
    return savedOrder;
  }
}

module.exports = CreateOrderUseCase;
