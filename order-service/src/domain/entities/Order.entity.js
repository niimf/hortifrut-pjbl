class Order {
  constructor({ id, customerName, total, status, createdAt }) {
    this.id = id;
    this.customerName = customerName;
    this.total = total;
    this.status = status || 'pending';
    this.createdAt = createdAt || new Date();
    
    this.validate();
  }

  validate() {
    if (!this.customerName || this.customerName.trim() === '') {
      throw new Error('Customer name is required');
    }
    if (this.total <= 0) {
      throw new Error('Order total must be greater than zero');
    }
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(this.status)) {
      throw new Error('Invalid order status');
    }
  }

  complete() {
    this.status = 'completed';
  }

  cancel() {
    this.status = 'cancelled';
  }

  toJSON() {
    return {
      id: this.id,
      customerName: this.customerName,
      total: this.total,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}

module.exports = Order;
