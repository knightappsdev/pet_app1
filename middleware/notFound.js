/**
 * 404 Not Found Middleware
 * Handles requests to non-existent endpoints
 */

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.originalUrl}`,
    message: 'The requested resource does not exist on this server.',
    availableEndpoints: [
      'GET /api - API information',
      'GET /api/health - Health check',
      'POST /api/auth/register - User registration',
      'POST /api/auth/login - User login',
      'GET /api/pets - Get user pets',
      'GET /api/services - Browse pet services',
      'GET /api/shop - Browse pet products',
      'GET /api/adoption - Browse adoptable pets'
    ]
  });
};

module.exports = notFound;