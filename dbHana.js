require('dotenv').config();
const hana = require('@sap/hana-client');

const connection = hana.createConnection();

async function connectDB() {
    try {
        await connection.connect({
            serverNode: process.env.DB_URL,
            uid: process.env.DB_USER,
            pwd: process.env.DB_PASS
        });
        console.log("Connected to SAP HANA!");
    } catch (error) {
        console.error("Connection Error:", error);
        process.exit(1);
    }
}

module.exports = { connection, connectDB };