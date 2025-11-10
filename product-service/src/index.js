const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Infrastructure
const MongoDBConnection = require('./infrastructure/database/mongoose/connection');
const ProductRepository = require('./infrastructure/database/mongoose/ProductRepository');

// Use Cases
const CreateProductUseCase = require('./application/use-cases/CreateProduct.usecase');
const GetAllProductsUseCase = require('./application/use-cases/GetAllProducts.usecase');
const GetProductByIdUseCase = require('./application/use-cases/GetProductById.usecase');
const UpdateProductUseCase = require('./application/use-cases/UpdateProduct.usecase');
const DeleteProductUseCase = require('./application/use-cases/DeleteProduct.usecase');

// Presentation
const ProductController = require('./presentation/controllers/ProductController');
const createProductRoutes = require('./presentation/routes/product.routes');
const errorHandler = require('./presentation/middlewares/errorHandler');

// Configuração
const PORT = process.env.PORT || 3001;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Dependency Injection
const productRepository = new ProductRepository();

const createProductUseCase = new CreateProductUseCase(productRepository);
const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const updateProductUseCase = new UpdateProductUseCase(productRepository);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

const productController = new ProductController(
  createProductUseCase,
  getAllProductsUseCase,
  getProductByIdUseCase,
  updateProductUseCase,
  deleteProductUseCase
);

// Routes
const productRoutes = createProductRoutes(productController);
app.use('/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product-service' });
});

// Error Handler
app.use(errorHandler);

// Start Server
async function startServer() {
  try {
    await MongoDBConnection.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 Product Service running on port ${PORT}`);
      console.log(`📊 Clean Architecture implemented`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
