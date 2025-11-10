const express = require('express');
const router = express.Router();

function createProductRoutes(productController) {
  // Bind do contexto do controller
  router.post('/', (req, res) => productController.create(req, res));
  router.get('/', (req, res) => productController.getAll(req, res));
  router.get('/:id', (req, res) => productController.getById(req, res));
  router.put('/:id', (req, res) => productController.update(req, res));
  router.delete('/:id', (req, res) => productController.delete(req, res));

  return router;
}

module.exports = createProductRoutes;
