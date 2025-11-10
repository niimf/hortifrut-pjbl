const eventPublisher = require('./EventPublisher');
const axios = require('axios');

class EventListener {
  constructor() {
    this.setupListeners();
  }

  setupListeners() {
    // Listener para ORDER_CREATED
    eventPublisher.on('orderCreated', (event) => {
      console.log('✅ Event Received: ORDER_CREATED');
      console.log('   Order ID:', event.payload.orderId);
      console.log('   Customer:', event.payload.customerName);
      console.log('   Total:', event.payload.total);
      
      // Aqui você pode chamar Azure Function via HTTP
      this.sendToAzureFunction(event);
    });

    // Listener para ORDER_UPDATED
    eventPublisher.on('orderUpdated', (event) => {
      console.log('✅ Event Received: ORDER_UPDATED');
      console.log('   Order ID:', event.payload.orderId);
      console.log('   New Status:', event.payload.status);
    });

    // Listener para ORDER_DELETED
    eventPublisher.on('orderDeleted', (event) => {
      console.log('✅ Event Received: ORDER_DELETED');
      console.log('   Order ID:', event.payload.orderId);
    });

    console.log('🎧 Event Listeners configured');
  }

  async sendToAzureFunction(event) {
    try {
        const azureFunctionUrl = process.env.AZURE_FUNCTION_URL || 
                                'http://localhost:7071/api/OrderCreatedHandler';
        
        console.log('📤 Sending event to Azure Function...');
        console.log('   URL:', azureFunctionUrl);
        console.log('   Event Type:', event.type);
        
        const response = await axios.post(azureFunctionUrl, event, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('✅ Azure Function Response:', response.data.message);
    } catch (error) {
        console.error('❌ Error calling Azure Function:', error.message);
    }
}

}

module.exports = EventListener;
