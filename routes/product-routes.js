const express = require('express');

// We only need the routing methods from express
const router = express.Router();

const ProductModel = require('../models/ProductModel.js');
const productController = require('../controllers/product-controller.js');

router.get('/', productController.getProducts);

router.post('/create', productController.createProduct);

module.exports = router;