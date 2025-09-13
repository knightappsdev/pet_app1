/**
 * E-commerce Routes
 * Handles pet supplies shop, products, orders, and recommendations
 */

const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get pet products
// @route   GET /api/shop/products
// @access  Public
router.get('/products', optionalAuth, async (req, res, next) => {
  try {
    const { category, species, brand, priceRange, page = 1, limit = 20 } = req.query;

    const sampleProducts = [
      {
        id: 'prod_1',
        name: 'Premium Dog Food - Chicken & Rice',
        brand: 'Royal Canin',
        category: 'food',
        species: ['dog'],
        price: 45.99,
        currency: 'GBP',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop',
        rating: 4.8,
        reviews: 124,
        inStock: true,
        description: 'High-quality dry dog food with chicken and rice for adult dogs'
      },
      {
        id: 'prod_2',
        name: 'Interactive Cat Toy Set',
        brand: 'PetSafe',
        category: 'toys',
        species: ['cat'],
        price: 19.99,
        currency: 'GBP',
        image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=300&h=300&fit=crop',
        rating: 4.6,
        reviews: 89,
        inStock: true,
        description: 'Engaging toy set to keep your cat active and entertained'
      },
      {
        id: 'prod_3',
        name: 'Comfortable Dog Bed - Large',
        brand: 'K&H Pet Products',
        category: 'accessories',
        species: ['dog'],
        price: 59.99,
        currency: 'GBP',
        image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=300&fit=crop',
        rating: 4.7,
        reviews: 156,
        inStock: true,
        description: 'Orthopedic dog bed with memory foam for large breeds'
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Pet supplies and products marketplace',
      count: sampleProducts.length,
      data: { products: sampleProducts }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get product by ID
// @route   GET /api/shop/products/:id
// @access  Public
router.get('/products/:id', async (req, res, next) => {
  try {
    const product = {
      id: req.params.id,
      name: 'Premium Dog Food - Chicken & Rice',
      brand: 'Royal Canin',
      category: 'food',
      species: ['dog'],
      price: 45.99,
      currency: 'GBP',
      images: [
        'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&h=500&fit=crop'
      ],
      rating: 4.8,
      reviews: 124,
      inStock: true,
      quantity: 50,
      description: 'High-quality dry dog food with chicken and rice for adult dogs. Specially formulated for optimal nutrition and digestive health.',
      ingredients: ['Chicken', 'Rice', 'Corn', 'Chicken Fat', 'Vitamins', 'Minerals'],
      nutritionalInfo: {
        protein: '26%',
        fat: '16%',
        fiber: '3%',
        moisture: '10%'
      },
      features: [
        'Balanced nutrition for adult dogs',
        'High-quality protein source',
        'Supports digestive health',
        'Made in the UK'
      ]
    };

    res.status(200).json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add item to cart
// @route   POST /api/shop/cart
// @access  Private
router.post('/cart', protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const cartItem = {
      id: 'cart_' + Date.now(),
      userId: req.user.id,
      productId,
      quantity,
      addedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: { cartItem }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get AI recommendations
// @route   GET /api/shop/recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res, next) => {
  try {
    const recommendations = [
      {
        id: 'rec_1',
        type: 'based_on_pets',
        title: 'Recommended for your pets',
        products: [
          {
            id: 'prod_rec_1',
            name: 'Dental Care Treats for Dogs',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200&h=200&fit=crop',
            reason: 'Great for Max\'s dental health'
          }
        ]
      },
      {
        id: 'rec_2',
        type: 'seasonal',
        title: 'Winter essentials',
        products: [
          {
            id: 'prod_rec_2',
            name: 'Warm Dog Coat',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
            reason: 'Keep your pet warm this winter'
          }
        ]
      }
    ];

    res.status(200).json({
      success: true,
      message: 'AI-powered product recommendations based on your pets',
      data: { recommendations }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create order
// @route   POST /api/shop/orders
// @access  Private
router.post('/orders', protect, async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    const order = {
      id: 'order_' + Date.now(),
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      status: 'confirmed',
      total: 45.99,
      currency: 'GBP',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! You will receive a confirmation email shortly.',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;