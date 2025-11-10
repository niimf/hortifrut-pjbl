const EventEmitter = require('events');

class EventPublisher extends EventEmitter {
  constructor() {
    super();
    this.eventLog = [];
  }

  publishOrderCreated(order) {
    const event = {
      type: 'ORDER_CREATED',
      timestamp: new Date().toISOString(),
      payload: {
        orderId: order.id,
        customerName: order.customerName,
        total: order.total,
        status: order.status
      }
    };

    console.log('📢 Event Published:', event.type, 'Order ID:', order.id);
    
    // Armazenar evento para logs
    this.eventLog.push(event);
    
    // Emitir evento
    this.emit('orderCreated', event);
    
    return event;
  }

  publishOrderUpdated(order) {
    const event = {
      type: 'ORDER_UPDATED',
      timestamp: new Date().toISOString(),
      payload: {
        orderId: order.id,
        status: order.status
      }
    };

    console.log('📢 Event Published:', event.type, 'Order ID:', order.id);
    this.eventLog.push(event);
    this.emit('orderUpdated', event);
    
    return event;
  }

  publishOrderDeleted(orderId) {
    const event = {
      type: 'ORDER_DELETED',
      timestamp: new Date().toISOString(),
      payload: { orderId }
    };

    console.log('📢 Event Published:', event.type, 'Order ID:', orderId);
    this.eventLog.push(event);
    this.emit('orderDeleted', event);
    
    return event;
  }

  getEventLog() {
    return this.eventLog;
  }
}

// Singleton instance
const eventPublisher = new EventPublisher();

module.exports = eventPublisher;
