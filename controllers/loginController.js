// controllers/loginController.js

const { connection } = require('../dbHana');
const jwt = require('jsonwebtoken');

// Login a user [READ]
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const result = await connection.exec(
            `SELECT * FROM USERS WHERE Email = ? AND PasswordHash = ?`,
            [email, password]
        );

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: user.UserID, email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update last login timestamp
        await connection.exec(`UPDATE USERS SET LastLogin = CURRENT_TIMESTAMP WHERE UserID = ?`, [user.UserID]);

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Read last login
async function lastLogin(req, res) {
    try {
        const result = await connection.exec(
            `SELECT UserID, Name, Email, LastLogin FROM USERS WHERE LastLogin IS NOT NULL ORDER BY LastLogin DESC LIMIT 1`
        );

        if (result.length === 0) {
            return res.status(404).json({ message: 'No recent login found' });
        }

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a password
async function updatePassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const sql = `UPDATE USERS SET PasswordHash = ? WHERE UserID = ?`;
        await connection.exec(sql, [password, id]);
        res.json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a user (remove password)
async function deletePassword(req, res) {
    const { id } = req.params;

    try {
        await connection.exec(`DELETE FROM USERS WHERE UserID = ?`, [id]);
        res.json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { login, lastLogin, updatePassword, deletePassword };
