const connectToMongoDB = require('./database');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// CONFIGURING .env FILE.
dotenv.config({path: __dirname+'/.env'});

// CONNECTING TO MONGODB DATABASE.
connectToMongoDB();

// CREATING EXPRESS APP.
const app = express();
const port = 5000;

// MIDDLEWARES.
app.use(cors());
app.use(express.json());

// ROUTES.
app.use('/api/auth', require('./routes/auth'));         // LOGIN & SIGNUP routes.
app.use('/api/books', require('./routes/book'));        // BOOKS routes.

// RUNNING THE APP ON LOCALHOST PORT.
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});