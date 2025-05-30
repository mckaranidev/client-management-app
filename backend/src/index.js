require('dotenv').config();
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const limiter = require('./middleware/rateLimit');
const clientRoutes = require('./routes/clients');

const app = express();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Middleware
const clientsRoutes = require('./routes/clients');

// Configure CORS to allow requests from the Vercel frontend
app.use(cors({
  origin: ['http://localhost:3001', 'https://client-management-app-ncsz.vercel.app']
}));

app.use(express.json());
app.use('/clients', clientsRoutes);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    body: req.body
  });
  next();
});

// Routes
app.use('/clients', clientRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ message: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on ${PORT}`);
});