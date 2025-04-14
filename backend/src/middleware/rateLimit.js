const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10), // Time window in milliseconds
  max: parseInt(process.env.RATE_LIMIT_MAX, 10), // Max requests per window
  message: 'Too many requests from this IP, please try again later.',
});

module.exports = limiter;