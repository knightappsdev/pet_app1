/**
 * Social Routes
 * Handles social community features, posts, connections, and playdates
 */

const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get social feed
// @route   GET /api/social/feed
// @access  Private
router.get('/feed', protect, async (req, res, next) => {
  try {
    const sampleFeed = [
      {
        id: 'post_1',
        user: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b48c?w=50&h=50&fit=crop&crop=face' },
        pet: { name: 'Max', species: 'dog' },
        content: 'Max had his first successful training session today! So proud of my little guy 🐕',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=400&fit=crop',
        likes: 12,
        comments: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 'post_2',
        user: { name: 'Mike Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face' },
        pet: { name: 'Luna', species: 'cat' },
        content: 'Looking for playmates for Luna in Manchester area. She loves other friendly cats!',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=400&fit=crop',
        likes: 8,
        comments: 5,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Pet community social feed',
      data: { posts: sampleFeed }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create social post
// @route   POST /api/social/posts
// @access  Private
router.post('/posts', protect, async (req, res, next) => {
  try {
    const { content, petId, image } = req.body;

    const post = {
      id: 'post_' + Date.now(),
      userId: req.user.id,
      petId,
      content,
      image,
      likes: 0,
      comments: 0,
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Find local pet owners
// @route   GET /api/social/nearby
// @access  Private
router.get('/nearby', protect, async (req, res, next) => {
  try {
    const { radius = 5 } = req.query;

    const nearbyOwners = [
      {
        id: 'user_1',
        name: 'Emma Thompson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        pets: [{ name: 'Buddy', species: 'dog', breed: 'Golden Retriever' }],
        distance: '0.8 miles',
        commonInterests: ['dog parks', 'training']
      },
      {
        id: 'user_2',
        name: 'James Miller',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        pets: [{ name: 'Whiskers', species: 'cat', breed: 'British Shorthair' }],
        distance: '1.2 miles',
        commonInterests: ['indoor cats', 'grooming']
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Local pet owners in your area',
      data: { nearbyOwners }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;