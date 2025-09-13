/**
 * Pet Routes
 * Handles pet profile management, health records, and pet-related operations
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const Pet = require('../models/Pet');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all pets for authenticated user
// @route   GET /api/pets
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { status, species } = req.query;
    
    let query = { owner: req.user.id };
    
    // Add filters
    if (status) query.status = status;
    if (species) query.species = species;

    const pets = await Pet.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pets.length,
      data: { pets }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('owner', 'firstName lastName email phone');

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check if user owns this pet or is authorized to view it
    if (pet.owner._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this pet'
      });
    }

    res.status(200).json({
      success: true,
      data: { pet }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private
router.post('/', protect, [
  body('name').trim().isLength({ min: 1 }).withMessage('Pet name is required'),
  body('species').isIn(['dog', 'cat', 'rabbit', 'bird', 'fish', 'hamster', 'guinea_pig', 'reptile', 'other']).withMessage('Invalid species'),
  body('breed').trim().isLength({ min: 1 }).withMessage('Breed is required'),
  body('gender').isIn(['male', 'female', 'unknown']).withMessage('Invalid gender'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('size').isIn(['extra_small', 'small', 'medium', 'large', 'extra_large']).withMessage('Invalid size')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Add user as owner
    req.body.owner = req.user.id;

    const pet = await Pet.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Pet profile created successfully!',
      data: { pet }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this pet'
      });
    }

    // Don't allow changing owner
    delete req.body.owner;

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Pet profile updated successfully',
      data: { pet }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this pet'
      });
    }

    await Pet.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Pet profile deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Add pet photo
// @route   POST /api/pets/:id/photos
// @access  Private
router.post('/:id/photos', protect, [
  body('url').isURL().withMessage('Valid photo URL is required'),
  body('caption').optional().isLength({ max: 200 }).withMessage('Caption cannot exceed 200 characters')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to add photos to this pet'
      });
    }

    const { url, caption, isPrimary } = req.body;

    // If setting as primary, remove primary from other photos
    if (isPrimary) {
      pet.photos.forEach(photo => {
        photo.isPrimary = false;
      });
    }

    pet.photos.push({
      url,
      caption,
      isPrimary: isPrimary || pet.photos.length === 0 // First photo is primary by default
    });

    await pet.save();

    res.status(201).json({
      success: true,
      message: 'Photo added successfully',
      data: { pet }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update health record
// @route   PUT /api/pets/:id/health
// @access  Private
router.put('/:id/health', protect, async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update health records for this pet'
      });
    }

    // Update health information
    const { conditions, allergies, medications, vaccinations, vetVisits, isSpayedNeutered, spayNeuterDate } = req.body;

    if (conditions) pet.health.conditions = conditions;
    if (allergies) pet.health.allergies = allergies;
    if (medications) pet.health.medications = medications;
    if (vaccinations) pet.health.vaccinations = vaccinations;
    if (vetVisits) pet.health.vetVisits = vetVisits;
    if (isSpayedNeutered !== undefined) pet.health.isSpayedNeutered = isSpayedNeutered;
    if (spayNeuterDate) pet.health.spayNeuterDate = spayNeuterDate;

    await pet.save();

    res.status(200).json({
      success: true,
      message: 'Health records updated successfully',
      data: { pet }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Add vaccination record
// @route   POST /api/pets/:id/vaccinations
// @access  Private
router.post('/:id/vaccinations', protect, [
  body('vaccine').trim().isLength({ min: 1 }).withMessage('Vaccine name is required'),
  body('dateGiven').isISO8601().withMessage('Valid vaccination date is required'),
  body('nextDue').optional().isISO8601().withMessage('Valid next due date required'),
  body('veterinarian').optional().trim().isLength({ min: 1 }).withMessage('Veterinarian name cannot be empty')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to add vaccinations for this pet'
      });
    }

    const { vaccine, dateGiven, nextDue, veterinarian, batchNumber, notes } = req.body;

    pet.health.vaccinations.push({
      vaccine,
      dateGiven: new Date(dateGiven),
      nextDue: nextDue ? new Date(nextDue) : null,
      veterinarian,
      batchNumber,
      notes
    });

    await pet.save();

    res.status(201).json({
      success: true,
      message: 'Vaccination record added successfully',
      data: { pet }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Add weight record
// @route   POST /api/pets/:id/weight
// @access  Private
router.post('/:id/weight', protect, [
  body('weight').isNumeric().withMessage('Weight must be a number'),
  body('date').optional().isISO8601().withMessage('Valid date required'),
  body('notes').optional().isLength({ max: 200 }).withMessage('Notes cannot exceed 200 characters')
], async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to add weight records for this pet'
      });
    }

    const { weight, date, notes } = req.body;

    // Update current weight
    pet.weight.current = weight;

    // Add to weight history
    pet.weight.history.push({
      weight,
      date: date ? new Date(date) : new Date(),
      notes
    });

    await pet.save();

    res.status(201).json({
      success: true,
      message: 'Weight record added successfully',
      data: { pet }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get pets available for adoption
// @route   GET /api/pets/adoption/available
// @access  Public
router.get('/adoption/available', async (req, res, next) => {
  try {
    const { species, size, location, limit = 20, skip = 0 } = req.query;
    
    let query = { 'adoption.isAvailable': true, status: 'active' };
    
    // Add filters
    if (species) query.species = species;
    if (size) query.size = size;

    const pets = await Pet.find(query)
      .populate('owner', 'firstName lastName businessName phone email address')
      .populate('adoption.rescueCenter', 'firstName lastName businessName phone email address')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ 'adoption.postedDate': -1 });

    const total = await Pet.countDocuments(query);

    res.status(200).json({
      success: true,
      count: pets.length,
      total,
      data: { pets }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;