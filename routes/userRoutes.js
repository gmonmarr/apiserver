// routes/userRoutes.js

const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

// CRUD Operations
// get all users
router.get('/', getUsers);

// create a user
router.post('/', createUser);

// update a user
router.put('/:id', updateUser);

// delete a user
router.delete('/:id', deleteUser);

module.exports = router;
