const express = require('express');
// We only need the routing methods from express
const router = express.Router();

// Importing the user controller file
const userController = require('../controllers/user-controller.js');

// Get all users from DB in JSON format
router.get('/', userController.getUsers);

// Create a User
router.post('/create', userController.createUser);

// Login a User
router.post('/login', userController.loginUser);

module.exports = router;