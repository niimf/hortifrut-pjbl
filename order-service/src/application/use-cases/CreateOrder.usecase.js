const Order = require('../../domain/entities/Order.entity');
const eventPublisher = require('../../infrastructure/events/EventPublisher');


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
  
    // 🔥 PUBLICAR EVENTO
    eventPublisher.publishOrderCreated(savedOrder);
  
    return savedOrder;
  }
}

module.exports = CreateOrderUseCase;
