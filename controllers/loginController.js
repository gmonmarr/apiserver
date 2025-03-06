// controllers/loginController.js

const { connection } = require('../dbHana');
const jwt = require('jsonwebtoken');

// Login a user [READ]
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const result = await connection.exec(
            `SELECT * FROM USERS WHERE EMAIL = ? AND PASSWORD = ?`,
            [email, password]
        );

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result[0];
        const token = jwt.sign(
            { id: user.ID, email: user.EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Read last login
async function lastLogin(req, res) {
    const { id } = req.params;

    try {
        const result = await connection.exec(
            `SELECT * FROM USERS WHERE LAST_LOGIN IS NOT NULL ORDER BY LAST_LOGIN DESC LIMIT 1`
        );
        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a password router.put('/:id', );
async function updatePassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const sql = `UPDATE USERS SET PASSWORD = ? WHERE ID = ?`;
        await connection.exec(sql, [password, id]);
        res.json({ message: 'Password updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Delete a password router.delete('/:id', );
async function deletePassword(req, res) {
    const { id } = req.params;

    try {
        await connection.exec(`DELETE FROM USERS WHERE ID = ?`, [id]);
        res.json({ message: 'Password deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = { login , lastLogin ,  updatePassword , deletePassword };
