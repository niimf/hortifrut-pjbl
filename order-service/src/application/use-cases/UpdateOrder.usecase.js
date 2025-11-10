const Order = require('../../domain/entities/Order.entity');

class UpdateOrderUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(orderId, updateData) {
    const existingOrder = await this.orderRepository.findById(orderId);
    
    if (!existingOrder) {
      throw new Error('Order not found');
    }

    const updatedOrder = new Order({
      id: orderId,
      customerName: updateData.customerName || existingOrder.customerName,
      total: updateData.total || existingOrder.total,
      status: updateData.status || existingOrder.status,
      createdAt: existingOrder.createdAt
    });

    const result = await this.orderRepository.update(orderId, updatedOrder);
    return result;
  }
}

module.exports = UpdateOrderUseCase;
