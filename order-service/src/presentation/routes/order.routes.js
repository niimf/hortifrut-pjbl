const express = require('express');
const router = express.Router();

function createOrderRoutes(orderController) {
  router.post('/', (req, res) => orderController.create(req, res));
  router.get('/', (req, res) => orderController.getAll(req, res));
  router.get('/:id', (req, res) => orderController.getById(req, res));
  router.put('/:id', (req, res) => orderController.update(req, res));
  router.delete('/:id', (req, res) => orderController.delete(req, res));

  return router;
}

module.exports = createOrderRoutes;
