// controllers/loginController.js

const { connection } = require('../dbHana');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;
const BCRYPT_SALT = process.env.BCRYPT_SALT || bcrypt.genSaltSync(BCRYPT_ROUNDS);

// Login a user [READ]
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const result = await connection.exec(
            `SELECT USERID, NAME, EMAIL, PASSWORDHASH FROM USERS WHERE EMAIL = ?`,
            [email]
        );

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result[0];

        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.PASSWORDHASH);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.USERID, email: user.EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update last login timestamp
        await connection.exec(`UPDATE USERS SET LASTLOGIN = CURRENT_TIMESTAMP WHERE USERID = ?`, [user.USERID]);

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a user's password [UPDATE]
async function updatePassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    try {
        // Hash new password
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT);

        const sql = `UPDATE USERS SET PASSWORDHASH = ? WHERE USERID = ?`;
        await connection.exec(sql, [hashedPassword, id]);

        res.json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Read last login for a specific user
async function lastLogin(req, res) {
    const { id } = req.params;

    try {
        const result = await connection.exec(
            `SELECT USERID, NAME, EMAIL, LASTLOGIN FROM USERS WHERE USERID = ? AND LASTLOGIN IS NOT NULL ORDER BY LASTLOGIN DESC LIMIT 1`,
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'No recent login found for this user' });
        }

        res.json(result[0].LASTLOGIN);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Set a user's password to 0 (block's login)
async function deletePassword(req, res) {
    const { id } = req.params;

    try {
        await connection.exec(`UPDATE USERS SET PASSWORDHASH = 0 WHERE USERID = ?`, [id]);
        res.json({ message: 'Password removed successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { login, lastLogin, updatePassword, deletePassword };
