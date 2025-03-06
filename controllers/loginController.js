// controllers/loginController.js

const { connection } = require('../dbHana');
const jwt = require('jsonwebtoken');

// Login a user [READ]
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const result = await connection.exec(
            `SELECT USERID, NAME, EMAIL, PASSWORDHASH FROM USERS WHERE EMAIL = ? AND PASSWORDHASH = ?`,
            [email, password]
        );

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: user.USERID, email: user.EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Update last login timestamp
        await connection.exec(`UPDATE USERS SET LASTLOGIN = CURRENT_TIMESTAMP WHERE USERID = ?`, [user.USERID]);

        console.log(`User ${user.USERID} logged in at ${new Date().toISOString()}`);

        res.json({ message: 'Login successful', token });
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

// Update a user's password
async function updatePassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const sql = `UPDATE USERS SET PASSWORDHASH = ? WHERE USERID = ?`;
        await connection.exec(sql, [password, id]);
        res.json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a user
async function deletePassword(req, res) {
    const { id } = req.params;

    try {
        await connection.exec(`DELETE FROM USERS WHERE USERID = ?`, [id]);
        res.json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { login, lastLogin, updatePassword, deletePassword };
