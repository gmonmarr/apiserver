// controllers/userController.js

const { connection } = require('../dbHana');

// Create a user [CREATE]
async function createUser(req, res) {
    const { name, email, password } = req.body;
    console.log('Creating user:', name, email, password);
    console.log('Creating user:', req.body);
    try {
        const checkSql = `SELECT COUNT(*) AS COUNT FROM USERS WHERE EMAIL = ?`;
        const checkResult = await connection.exec(checkSql, [email]);

        if (checkResult[0].COUNT > 0) {
            return res.status(400).json({ message: `User with email ${email} already exists.` });
        }

        const sql = `INSERT INTO USERS (NAME, EMAIL, PASSWORDHASH, CREATEDAT) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
        await connection.exec(sql, [name, email, password]);

        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Get all users [READ]
async function getUsers(req, res) {
    try {
        const result = await connection.exec(`SELECT USERID, NAME, EMAIL, LASTLOGIN, CREATEDAT FROM USERS`);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a user [UPDATE]
async function updateUser(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const sql = `UPDATE USERS SET NAME = ?, EMAIL = ? WHERE USERID = ?`;
        await connection.exec(sql, [name, email, id]);
        res.json({ message: 'User updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete a user [DELETE]
async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        await connection.exec(`DELETE FROM USERS WHERE USERID = ?`, [id]);
        res.json({ message: 'User deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getUsers, createUser, updateUser, deleteUser };
