// routes/loginRoutes.js

/**
 * @swagger
 * tags:
 *   name: Login Routes
 *   description: User authentication and password management
 */

const express = require('express');
const { login, lastLogin, updatePassword, deletePassword } = require('../controllers/loginController');

const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Login Routes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post('/', login);

/**
 * @swagger
 * /login/last/{id}:
 *   get:
 *     summary: Get last login of a user
 *     tags: [Login Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Returns last login info
 *       404:
 *         description: No recent login found
 */
router.get('/last/:id', lastLogin);

/**
 * @swagger
 * /login/{id}:
 *   put:
 *     summary: Update a user's password
 *     tags: [Login Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: newSecurePass123
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.put('/:id', updatePassword);

/**
 * @swagger
 * /login/{id}:
 *   delete:
 *     summary: Remove a user's password
 *     tags: [Login Routes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     responses:
 *       200:
 *         description: Password removed successfully
 */
router.delete('/:id', deletePassword);

module.exports = router;
