/**
 * Pet Care & Support API Server
 * 
 * A comprehensive backend API for UK pet owners providing:
 * - Pet Services Marketplace
 * - Pet Health & Wellness Management
 * - Social Community Features
 * - E-commerce Capabilities
 * - Pet Adoption & Rescue Integration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const petRoutes = require('./routes/pets');
const servicesRoutes = require('./routes/services');
const healthRoutes = require('./routes/health');
const socialRoutes = require('./routes/social');
const ecommerceRoutes = require('./routes/ecommerce');
const adoptionRoutes = require('./routes/adoption');
const emergencyRoutes = require('./routes/emergency');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Constants
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', '*.clackypaas.com'],
  credentials: true
}));

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('👤 User connected:', socket.id);
  
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });
  
  socket.on('disconnect', () => {
    console.log('👤 User disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root welcome route
app.get('/', (req, res) => {
  const acceptHeader = req.get('Accept') || '';
  
  // If request is from browser (HTML), return HTML page
  if (acceptHeader.includes('text/html')) {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pet Care & Support API</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 50px;
        }
        .logo {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 600;
        }
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        .status {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 25px;
            margin-bottom: 50px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 50px;
        }
        .feature-card {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .feature-card h3 {
            font-size: 1.3rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .feature-card p {
            opacity: 0.9;
            line-height: 1.5;
        }
        .endpoints {
            background: rgba(0,0,0,0.2);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
        }
        .endpoints h2 {
            margin-bottom: 20px;
            text-align: center;
        }
        .endpoint-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .endpoint {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        .endpoint a {
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
        }
        .endpoint a:hover {
            text-decoration: underline;
        }
        .info {
            text-align: center;
            opacity: 0.8;
            margin-top: 30px;
        }
        @media (max-width: 768px) {
            .logo { font-size: 3rem; }
            h1 { font-size: 2rem; }
            .features { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🐾</div>
            <h1>Pet Care & Support API</h1>
            <p class="subtitle">Comprehensive API for UK Pet Care & Support Mobile Application</p>
            <div class="status">
                ✅ Server Running Successfully
            </div>
        </div>
        
        <div class="features">
            <div class="feature-card">
                <h3>🔐 Authentication & Profiles</h3>
                <p>Secure user registration, login, and profile management with JWT tokens and UK-specific validations.</p>
            </div>
            <div class="feature-card">
                <h3>🐕 Pet Profile Management</h3>
                <p>Comprehensive pet profiles with health records, behavior tracking, photos, and medical history.</p>
            </div>
            <div class="feature-card">
                <h3>🏪 Pet Services Marketplace</h3>
                <p>Book dog walkers, pet sitters, groomers, and trainers with reviews, ratings, and GPS tracking.</p>
            </div>
            <div class="feature-card">
                <h3>🏥 Health & Wellness Tracking</h3>
                <p>Medical records, vaccination reminders, vet appointments, and health dashboard features.</p>
            </div>
            <div class="feature-card">
                <h3>👥 Social Community Features</h3>
                <p>Social feed, local pet owner connections, playdates, and advice sharing community.</p>
            </div>
            <div class="feature-card">
                <h3>🛒 E-commerce Integration</h3>
                <p>Pet supplies shop with cart functionality, AI recommendations, and subscription services.</p>
            </div>
            <div class="feature-card">
                <h3>🏡 Pet Adoption & Rescue</h3>
                <p>Showcase adoptable pets from UK shelters with search, filtering, and donation features.</p>
            </div>
            <div class="feature-card">
                <h3>🚨 Emergency Services</h3>
                <p>24-hour emergency vet locator, care guidance, and urgent appointment booking.</p>
            </div>
        </div>
        
        <div class="endpoints">
            <h2>📚 API Endpoints</h2>
            <div class="endpoint-grid">
                <div class="endpoint">
                    <a href="/api">API Documentation</a>
                </div>
                <div class="endpoint">
                    <a href="/api/health">Health Check</a>
                </div>
                <div class="endpoint">
                    <a href="/api/auth">Authentication</a>
                </div>
                <div class="endpoint">
                    <a href="/api/pets">Pet Management</a>
                </div>
                <div class="endpoint">
                    <a href="/api/services">Services</a>
                </div>
                <div class="endpoint">
                    <a href="/api/social">Social Features</a>
                </div>
                <div class="endpoint">
                    <a href="/api/shop">E-commerce</a>
                </div>
                <div class="endpoint">
                    <a href="/api/adoption">Adoption</a>
                </div>
                <div class="endpoint">
                    <a href="/api/emergency">Emergency</a>
                </div>
            </div>
        </div>
        
        <div class="info">
            <p><strong>Version:</strong> 1.0.0 | <strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            <p><strong>Server Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Built for:</strong> UK Pet Owners & Service Providers</p>
        </div>
    </div>
</body>
</html>
    `);
  } else {
    // For API clients (JSON), return JSON response
    res.json({
      success: true,
      message: '🐾 Welcome to Pet Care & Support API!',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      server: `http://localhost:${PORT}`,
      documentation: `/api`,
      healthCheck: '/api/health',
      status: '✅ Server is running successfully!',
      features: [
        '🔐 User Authentication & Profiles',
        '🐕 Pet Profile Management', 
        '🏪 Pet Services Marketplace',
        '🏥 Health & Wellness Tracking',
        '👥 Social Community Features',
        '🛒 E-commerce Integration',
        '🏡 Pet Adoption & Rescue',
        '🚨 Emergency Services',
        '📱 Real-time Notifications'
      ]
    });
  }
});

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).send(); // No content
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Pet Care API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Pet Care & Support API',
    version: '1.0.0',
    description: 'Comprehensive API for UK pet owners',
    features: [
      'User Authentication & Profiles',
      'Pet Profile Management',
      'Pet Services Marketplace',
      'Health & Wellness Tracking',
      'Social Community Features',
      'E-commerce Integration',
      'Pet Adoption & Rescue',
      'Emergency Services',
      'Real-time Notifications'
    ],
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      pets: '/api/pets',
      services: '/api/services',
      health: '/api/health-records',
      social: '/api/social',
      ecommerce: '/api/shop',
      adoption: '/api/adoption',
      emergency: '/api/emergency'
    },
    documentation: 'https://docs.petcare.uk/api',
    support: 'support@petcare.uk'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/health-records', healthRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/shop', ecommerceRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/emergency', emergencyRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`
🐾 Pet Care & Support API Server Started!
📊 Environment: ${process.env.NODE_ENV}
🌐 Server: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api
🏥 Health Check: http://localhost:${PORT}/api/health
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = app;