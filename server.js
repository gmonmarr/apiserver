require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { connectDB } = require('./dbHana');
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');
const { login } = require('./controllers/loginController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SAP HANA CRUD API",
            version: "1.0.0",
            description: "API for user management and authentication"
        },
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/users', userRoutes);
app.use('/login', loginRoutes);

// Start Server
connectDB();
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
