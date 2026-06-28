const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const authRoutes = require('./routes/auth.routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Basic route for testing
// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Lost and Found Portal API' });
});

// Error Middleware (must be after all routes)
app.use(errorHandler);

module.exports = app;
