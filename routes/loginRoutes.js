// routes/loginRoutes.js

const express = require('express');
const { login } = require('../controllers/loginController');

const router = express.Router();

// CRUD operation
// Login a user
router.post('/', login);

// Read last login
router.get('/last/:id', lastLogin );

// Update a password
router.put('/:id', updatePassword );

// Delete a password 
router.delete('/:id', deletePassword );



module.exports = router;
