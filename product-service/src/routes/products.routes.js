const express = require('express');
const router = express.Router();

// Importar features (Vertical Slices)
const CreateProductFeature = require('../../features/products/create');
const ListProductsFeature = require('../../features/products/list');
const GetProductByIdFeature = require('../../features/products/get-by-id');
const UpdateProductFeature = require('../../features/products/update');
const DeleteProductFeature = require('../../features/products/delete');

// Instanciar features
const createProduct = new CreateProductFeature();
const listProducts = new ListProductsFeature();
const getProductById = new GetProductByIdFeature();
const updateProduct = new UpdateProductFeature();
const deleteProduct = new DeleteProductFeature();

// Rotas mapeadas para features
router.post('/', (req, res) => createProduct.handle(req, res));
router.get('/', (req, res) => listProducts.handle(req, res));
router.get('/:id', (req, res) => getProductById.handle(req, res));
router.put('/:id', (req, res) => updateProduct.handle(req, res));
router.delete('/:id', (req, res) => deleteProduct.handle(req, res));

module.exports = router;
