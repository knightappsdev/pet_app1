/**
 * User Routes
 * Handles user management and profile operations
 */

const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get service providers
// @route   GET /api/users/service-providers
// @access  Public
router.get('/service-providers', async (req, res, next) => {
  try {
    const { serviceType, location, radius = 10 } = req.query;
    
    let query = { 
      role: 'service_provider', 
      isActive: true 
    };
    
    if (serviceType) {
      query.serviceTypes = { $in: [serviceType] };
    }

    const providers = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: providers.length,
      data: { providers }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;