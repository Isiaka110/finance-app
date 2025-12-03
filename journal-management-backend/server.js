// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Init Middleware
// Allows us to get data in req.body
app.use(express.json({ extended: false }));

// Define Routes
// We'll use /api as the prefix for all API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Simple test route
app.get('/', (req, res) => res.send('Journal Management API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));