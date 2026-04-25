const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const fieldRoutes = require('./routes/fieldRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

console.log('CORS Origins:', allowedOrigins);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CORS_ORIGINS env var:', process.env.CORS_ORIGINS);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('CORS request from origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('No origin header, allowing request');
        return callback(null, true);
      }
      
      // check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        console.log('Origin allowed:', origin);
        return callback(null, true);
      } else {
        console.log('Origin rejected:', origin);
        // don't throw error, just reject the origin
        return callback(null, false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200, 
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    preflightContinue: false
  })
);



// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'SmartSeason Field Monitoring System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      fields: '/api/fields',
      dashboard: '/api/dashboard',
      health: '/api/health'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API is running',
    status: 'healthy'
  });
});

module.exports = app;
