/**
 * Adoption Routes
 * Handles pet adoption and rescue center integration
 */

const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get adoptable pets
// @route   GET /api/adoption/pets
// @access  Public
router.get('/pets', optionalAuth, async (req, res, next) => {
  try {
    const { species, age, size, location, page = 1, limit = 20 } = req.query;

    const adoptablePets = [
      {
        id: 'adopt_1',
        name: 'Bella',
        species: 'dog',
        breed: 'Labrador Mix',
        age: 3,
        size: 'large',
        gender: 'female',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        description: 'Bella is a friendly and energetic dog who loves playing fetch and going on long walks. She\'s great with children and other dogs.',
        rescueCenter: {
          id: 'rescue_1',
          name: 'Happy Tails Rescue',
          location: 'Manchester, UK',
          phone: '+44 161 123 4567',
          email: 'info@happytailsrescue.org.uk'
        },
        adoptionFee: 150,
        currency: 'GBP',
        vaccinationStatus: 'Up to date',
        neutered: true,
        microchipped: true,
        goodWith: {
          children: true,
          dogs: true,
          cats: false
        },
        specialNeeds: [],
        postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
      },
      {
        id: 'adopt_2',
        name: 'Whiskers',
        species: 'cat',
        breed: 'Domestic Shorthair',
        age: 2,
        size: 'medium',
        gender: 'male',
        image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
        description: 'Whiskers is a calm and affectionate cat who enjoys quiet companionship. Perfect for a peaceful home environment.',
        rescueCenter: {
          id: 'rescue_2',
          name: 'London Cat Rescue',
          location: 'London, UK',
          phone: '+44 20 7123 4567',
          email: 'adopt@londoncatrescue.org.uk'
        },
        adoptionFee: 100,
        currency: 'GBP',
        vaccinationStatus: 'Up to date',
        neutered: true,
        microchipped: true,
        goodWith: {
          children: true,
          dogs: false,
          cats: true
        },
        specialNeeds: [],
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ];

    res.status(200).json({
      success: true,
      message: 'Find your perfect companion - adoptable pets from UK rescue centers',
      count: adoptablePets.length,
      data: { pets: adoptablePets }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get pet adoption details
// @route   GET /api/adoption/pets/:id
// @access  Public
router.get('/pets/:id', async (req, res, next) => {
  try {
    const pet = {
      id: req.params.id,
      name: 'Bella',
      species: 'dog',
      breed: 'Labrador Mix',
      age: 3,
      size: 'large',
      gender: 'female',
      images: [
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=500&fit=crop'
      ],
      description: 'Bella is a friendly and energetic dog who loves playing fetch and going on long walks. She\'s great with children and other dogs. Bella came to us as a stray and has been waiting for her forever home for 2 months.',
      personality: ['Friendly', 'Energetic', 'Loyal', 'Playful'],
      story: 'Bella was found wandering the streets of Manchester and brought to our rescue center. Despite her rough start, she has maintained her loving and trusting nature. She\'s looking for an active family who can give her the love and exercise she deserves.',
      rescueCenter: {
        id: 'rescue_1',
        name: 'Happy Tails Rescue',
        location: 'Manchester, UK',
        address: '123 Rescue Street, Manchester M1 1AA',
        phone: '+44 161 123 4567',
        email: 'info@happytailsrescue.org.uk',
        website: 'www.happytailsrescue.org.uk'
      },
      adoptionFee: 150,
      currency: 'GBP',
      medicalInfo: {
        vaccinationStatus: 'Up to date',
        neutered: true,
        microchipped: true,
        healthConditions: [],
        lastVetVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 1 month ago
      },
      compatibility: {
        goodWith: {
          children: true,
          dogs: true,
          cats: false
        },
        activityLevel: 'High',
        experienceRequired: 'Beginner friendly'
      },
      requirements: [
        'Secure garden required',
        'Daily exercise commitment',
        'No cats in the household',
        'Home check required'
      ],
      specialNeeds: [],
      postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    };

    res.status(200).json({
      success: true,
      data: { pet }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Submit adoption application
// @route   POST /api/adoption/apply
// @access  Private
router.post('/apply', protect, async (req, res, next) => {
  try {
    const { petId, message, experience, livingArrangement, otherPets } = req.body;

    const application = {
      id: 'app_' + Date.now(),
      petId,
      applicantId: req.user.id,
      message,
      experience,
      livingArrangement,
      otherPets,
      status: 'submitted',
      submittedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Adoption application submitted successfully! The rescue center will contact you within 48 hours.',
      data: { application }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get rescue centers
// @route   GET /api/adoption/rescue-centers
// @access  Public
router.get('/rescue-centers', async (req, res, next) => {
  try {
    const { location, radius = 25 } = req.query;

    const rescueCenters = [
      {
        id: 'rescue_1',
        name: 'Happy Tails Rescue',
        location: 'Manchester, UK',
        address: '123 Rescue Street, Manchester M1 1AA',
        phone: '+44 161 123 4567',
        email: 'info@happytailsrescue.org.uk',
        website: 'www.happytailsrescue.org.uk',
        description: 'Dedicated to rescuing and rehoming dogs and cats across Greater Manchester',
        specialties: ['Dogs', 'Cats'],
        established: 2010,
        volunteersNeeded: true,
        donationsAccepted: true,
        availablePets: 23
      },
      {
        id: 'rescue_2',
        name: 'London Cat Rescue',
        location: 'London, UK',
        address: '456 Feline Avenue, London SW1 2BB',
        phone: '+44 20 7123 4567',
        email: 'adopt@londoncatrescue.org.uk',
        website: 'www.londoncatrescue.org.uk',
        description: 'Specialist cat rescue center serving London and surrounding areas',
        specialties: ['Cats'],
        established: 2005,
        volunteersNeeded: true,
        donationsAccepted: true,
        availablePets: 18
      }
    ];

    res.status(200).json({
      success: true,
      message: 'UK rescue centers working to find homes for pets in need',
      count: rescueCenters.length,
      data: { rescueCenters }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Make donation to rescue center
// @route   POST /api/adoption/donate
// @access  Private
router.post('/donate', protect, async (req, res, next) => {
  try {
    const { rescueCenterId, amount, message, isRecurring } = req.body;

    const donation = {
      id: 'donation_' + Date.now(),
      donorId: req.user.id,
      rescueCenterId,
      amount,
      currency: 'GBP',
      message,
      isRecurring,
      status: 'completed',
      donatedAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: 'Thank you for your generous donation! Your support helps save lives.',
      data: { donation }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;