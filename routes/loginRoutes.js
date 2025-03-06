// routes/loginRoutes.js

const express = require('express');
const { login, lastLogin, updatePassword, deletePassword } = require('../controllers/loginController');

const router = express.Router();

// Authentication & Password Management
router.post('/', login); // Login a user
router.get('/last/:id', lastLogin); // Get last login of a user
router.put('/:id', updatePassword); // Update a user's password
router.delete('/:id', deletePassword); // Delete a user

module.exports = router;
