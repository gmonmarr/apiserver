// routes/userRoutes.js

const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// CRUD Operations
router.get('/', getUsers); // Get all users
router.post('/', createUser); // Create a user
router.put('/:id', updateUser); // Update a user
router.delete('/:id', deleteUser); // Delete a user

module.exports = router;
