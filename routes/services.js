/**
 * Services Routes
 * Handles pet service bookings, marketplace, and service provider management
 */

const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get available services
// @route   GET /api/services
// @access  Public
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { type, location, date, radius = 10 } = req.query;
    
    const services = {
      dog_walking: {
        name: 'Dog Walking',
        description: 'Professional dog walking services',
        averagePrice: '£15-25/hour',
        providers: []
      },
      pet_sitting: {
        name: 'Pet Sitting',
        description: 'In-home pet care and sitting',
        averagePrice: '£20-35/day',
        providers: []
      },
      grooming: {
        name: 'Pet Grooming',
        description: 'Professional grooming services',
        averagePrice: '£30-60/session',
        providers: []
      },
      training: {
        name: 'Pet Training',
        description: 'Obedience and behavior training',
        averagePrice: '£40-80/session',
        providers: []
      },
      veterinary: {
        name: 'Veterinary Care',
        description: '24/7 veterinary services',
        averagePrice: '£60-150/consultation',
        providers: []
      }
    };

    res.status(200).json({
      success: true,
      message: 'Pet services marketplace - connecting UK pet owners with trusted professionals',
      data: { services }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Book a service
// @route   POST /api/services/book
// @access  Private
router.post('/book', protect, async (req, res, next) => {
  try {
    const { serviceType, providerId, petId, date, duration, notes } = req.body;

    res.status(201).json({
      success: true,
      message: 'Service booking request created successfully',
      data: {
        booking: {
          id: 'booking_' + Date.now(),
          serviceType,
          providerId,
          petId,
          date,
          duration,
          notes,
          status: 'pending',
          createdAt: new Date()
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;