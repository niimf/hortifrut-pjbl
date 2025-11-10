module.exports = async function (context, req) {
    context.log('🚀 Azure Function triggered: OrderCreatedHandler');

    const event = req.body;

    if (!event || !event.type) {
        context.res = {
            status: 400,
            body: { error: 'Invalid event format' }
        };
        return;
    }

    context.log('📨 Event Type:', event.type);
    context.log('⏰ Timestamp:', event.timestamp);
    context.log('📦 Payload:', JSON.stringify(event.payload, null, 2));

    // Processar evento baseado no tipo
    switch (event.type) {
        case 'ORDER_CREATED':
            await processOrderCreated(context, event.payload);
            break;
        case 'ORDER_UPDATED':
            await processOrderUpdated(context, event.payload);
            break;
        case 'ORDER_DELETED':
            await processOrderDeleted(context, event.payload);
            break;
        default:
            context.log('⚠️  Unknown event type:', event.type);
    }

    context.res = {
        status: 200,
        body: {
            message: 'Event processed successfully',
            eventType: event.type,
            processedAt: new Date().toISOString()
        }
    };
};

async function processOrderCreated(context, payload) {
    context.log('✅ Processing ORDER_CREATED');
    context.log('   Order ID:', payload.orderId);
    context.log('   Customer:', payload.customerName);
    context.log('   Total:', payload.total);
    context.log('   Status:', payload.status);

    // Aqui você pode:
    // - Enviar email de confirmação
    // - Atualizar sistema de estoque
    // - Registrar em analytics
    // - Enviar notificação push
    
    context.log('📧 Sending confirmation email to customer...');
    context.log('📊 Updating analytics dashboard...');
    context.log('✅ Order processed successfully!');
}

async function processOrderUpdated(context, payload) {
    context.log('🔄 Processing ORDER_UPDATED');
    context.log('   Order ID:', payload.orderId);
    context.log('   New Status:', payload.status);
}

async function processOrderDeleted(context, payload) {
    context.log('🗑️  Processing ORDER_DELETED');
    context.log('   Order ID:', payload.orderId);
}
