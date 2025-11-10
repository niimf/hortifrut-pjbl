require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Infrastructure
const AzureSQLConnection = require('./infrastructure/database/mssql/connection');
const OrderRepository = require('./infrastructure/database/mssql/OrderRepository');

// Use Cases
const CreateOrderUseCase = require('./application/use-cases/CreateOrder.usecase');
const GetAllOrdersUseCase = require('./application/use-cases/GetAllOrders.usecase');
const GetOrderByIdUseCase = require('./application/use-cases/GetOrderById.usecase');
const UpdateOrderUseCase = require('./application/use-cases/UpdateOrder.usecase');
const DeleteOrderUseCase = require('./application/use-cases/DeleteOrder.usecase');

// Presentation
const OrderController = require('./presentation/controllers/OrderController');
const createOrderRoutes = require('./presentation/routes/order.routes');
const errorHandler = require('./presentation/middlewares/errorHandler');

// Configuração
const PORT = process.env.PORT || 3002;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Dependency Injection
const orderRepository = new OrderRepository();

const createOrderUseCase = new CreateOrderUseCase(orderRepository);
const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);
const getOrderByIdUseCase = new GetOrderByIdUseCase(orderRepository);
const updateOrderUseCase = new UpdateOrderUseCase(orderRepository);
const deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);

const orderController = new OrderController(
  createOrderUseCase,
  getAllOrdersUseCase,
  getOrderByIdUseCase,
  updateOrderUseCase,
  deleteOrderUseCase
);

// Routes
const orderRoutes = createOrderRoutes(orderController);
app.use('/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' });
});

// Error Handler
app.use(errorHandler);

// Start Server
async function startServer() {
  try {
    await AzureSQLConnection.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 Order Service running on port ${PORT}`);
      console.log(`📊 Clean Architecture implemented`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
// Event-Driven Architecture
const EventListener = require('./infrastructure/events/EventListener');
const eventPublisher = require('./infrastructure/events/EventPublisher');

// Inicializar Event Listener
const eventListener = new EventListener();

// Adicionar rota para visualizar log de eventos
app.get('/events', (req, res) => {
  res.json({
    success: true,
    events: eventPublisher.getEventLog(),
    totalEvents: eventPublisher.getEventLog().length
  });
});


startServer();
