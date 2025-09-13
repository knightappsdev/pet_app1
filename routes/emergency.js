/**
 * Emergency Routes
 * Handles emergency vet services, 24-hour clinics, and urgent pet care
 */

const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Find emergency vets near location
// @route   GET /api/emergency/vets
// @access  Public
router.get('/vets', optionalAuth, async (req, res, next) => {
  try {
    const { latitude, longitude, postcode, radius = 15 } = req.query;

    const emergencyVets = [
      {
        id: 'evet_1',
        name: 'VetsNow Manchester Emergency',
        address: '789 Emergency Road, Manchester M2 3CC',
        phone: '0161 999 8888',
        emergencyPhone: '0161 999 8888',
        distance: 2.3,
        isOpen24Hours: true,
        currentStatus: 'Open',
        services: [
          'Emergency surgery',
          'Critical care',
          'Diagnostic imaging',
          'Laboratory services',
          'Poison treatment'
        ],
        waitTime: '15-30 minutes',
        acceptsWalkIns: true,
        rating: 4.7,
        reviews: 198
      },
      {
        id: 'evet_2',
        name: 'Animal Emergency Hospital',
        address: '456 Urgent Care Street, Manchester M3 4DD',
        phone: '0161 888 7777',
        emergencyPhone: '0161 888 7777',
        distance: 3.8,
        isOpen24Hours: false,
        openingHours: {
          weekdays: '18:00 - 08:00',
          weekend: '24 hours'
        },
        currentStatus: 'Open',
        services: [
          'Emergency consultations',
          'X-rays',
          'Blood tests',
          'Minor surgery',
          'Pain management'
        ],
        waitTime: '20-45 minutes',
        acceptsWalkIns: true,
        rating: 4.5,
        reviews: 156
      },
      {
        id: 'evet_3',
        name: 'City Centre Veterinary Emergency',
        address: '123 Central Vet Plaza, Manchester M1 5EE',
        phone: '0161 777 6666',
        emergencyPhone: '0161 777 6666',
        distance: 5.2,
        isOpen24Hours: true,
        currentStatus: 'Open',
        services: [
          'Trauma care',
          'Cardiac emergencies',
          'Respiratory support',
          'Intensive care',
          'Emergency dentistry'
        ],
        waitTime: '10-25 minutes',
        acceptsWalkIns: true,
        rating: 4.8,
        reviews: 243
      }
    ];

    res.status(200).json({
      success: true,
      message: '24-hour emergency veterinary services near you',
      count: emergencyVets.length,
      data: { emergencyVets }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get emergency care guide
// @route   GET /api/emergency/guide
// @access  Public
router.get('/guide', async (req, res, next) => {
  try {
    const emergencyGuide = {
      commonEmergencies: [
        {
          condition: 'Poisoning',
          symptoms: ['Vomiting', 'Diarrhea', 'Difficulty breathing', 'Seizures'],
          immediateActions: [
            'Remove source of poison if safe',
            'Do NOT induce vomiting unless instructed',
            'Contact emergency vet immediately',
            'Bring poison container/sample if possible'
          ],
          urgency: 'Critical - Seek immediate help'
        },
        {
          condition: 'Traffic Accident/Trauma',
          symptoms: ['Visible injuries', 'Difficulty moving', 'Bleeding', 'Unconsciousness'],
          immediateActions: [
            'Keep pet calm and still',
            'Apply pressure to bleeding wounds',
            'Transport carefully on flat surface',
            'Contact emergency vet en route'
          ],
          urgency: 'Critical - Seek immediate help'
        },
        {
          condition: 'Difficulty Breathing',
          symptoms: ['Labored breathing', 'Blue gums', 'Excessive panting', 'Choking sounds'],
          immediateActions: [
            'Keep pet calm',
            'Check for foreign objects in mouth',
            'Ensure airway is clear',
            'Seek emergency care immediately'
          ],
          urgency: 'Critical - Seek immediate help'
        },
        {
          condition: 'Seizures',
          symptoms: ['Uncontrolled shaking', 'Loss of consciousness', 'Drooling', 'Paddling motions'],
          immediateActions: [
            'Do NOT put hands near mouth',
            'Move pet away from hazards',
            'Time the seizure duration',
            'Contact vet if seizure lasts >5 minutes'
          ],
          urgency: 'Urgent - Contact vet immediately'
        }
      ],
      firstAidTips: [
        {
          situation: 'Bleeding',
          steps: [
            'Apply direct pressure with clean cloth',
            'Elevate wound if possible',
            'Do not remove embedded objects',
            'Wrap securely but not too tight'
          ]
        },
        {
          situation: 'Burns',
          steps: [
            'Cool with cold water for 10-15 minutes',
            'Do not use ice',
            'Cover with clean, damp cloth',
            'Seek veterinary care'
          ]
        }
      ],
      emergencyContactInfo: {
        ukEmergencyVets: '0800 195 2000',
        poisonHelpline: '01202 509 000',
        rspca24Hour: '0300 1234 999'
      },
      preparationChecklist: [
        'Keep emergency vet numbers easily accessible',
        'Have a pet first aid kit ready',
        'Know location of nearest emergency clinic',
        'Keep pet carrier accessible',
        'Have recent photos of your pet',
        'Keep vaccination records updated'
      ]
    };

    res.status(200).json({
      success: true,
      message: 'Emergency pet care guide and first aid information',
      data: { emergencyGuide }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Report emergency case
// @route   POST /api/emergency/report
// @access  Private
router.post('/report', protect, async (req, res, next) => {
  try {
    const { petId, condition, symptoms, severity, location, description } = req.body;

    const emergencyCase = {
      id: 'emrg_' + Date.now(),
      petId,
      ownerId: req.user.id,
      condition,
      symptoms,
      severity,
      location,
      description,
      status: 'reported',
      reportedAt: new Date(),
      recommendedAction: severity === 'critical' ? 'Seek immediate emergency care' : 'Contact your regular vet'
    };

    // In a real application, this would trigger notifications to nearby emergency vets
    const nearestVet = {
      name: 'VetsNow Manchester Emergency',
      phone: '0161 999 8888',
      address: '789 Emergency Road, Manchester M2 3CC',
      estimatedArrival: '5-10 minutes'
    };

    res.status(201).json({
      success: true,
      message: 'Emergency case reported. Immediate assistance recommended.',
      data: { 
        emergencyCase,
        nearestVet,
        urgent: severity === 'critical'
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get emergency preparedness info
// @route   GET /api/emergency/preparedness
// @access  Public
router.get('/preparedness', async (req, res, next) => {
  try {
    const preparednessInfo = {
      emergencyKit: {
        essentials: [
          'Gauze pads and bandages',
          'Adhesive tape',
          'Digital thermometer',
          'Hydrogen peroxide (3%)',
          'Antiseptic wipes',
          'Emergency blanket',
          'Muzzle (appropriate size)',
          'Flashlight',
          'Emergency contact numbers'
        ],
        medications: [
          'Current prescription medications',
          'Activated charcoal (with vet approval)',
          'Diphenhydramine (Benadryl) - with vet dosage',
          'Saline solution for eye/wound irrigation'
        ]
      },
      emergencyPlan: {
        preparation: [
          'Identify 2-3 emergency vet clinics in your area',
          'Save emergency numbers in your phone',
          'Practice handling your pet calmly',
          'Know your pet\'s baseline vital signs',
          'Keep carrier easily accessible'
        ],
        documentation: [
          'Recent photos of your pet',
          'Vaccination records',
          'List of current medications',
          'Medical history summary',
          'Emergency contact information'
        ]
      },
      vitalSigns: {
        dogs: {
          heartRate: '60-140 beats per minute (varies by size)',
          respiratoryRate: '10-30 breaths per minute',
          temperature: '38.0-39.2°C (100.4-102.5°F)'
        },
        cats: {
          heartRate: '140-220 beats per minute',
          respiratoryRate: '20-30 breaths per minute',
          temperature: '38.0-39.2°C (100.4-102.5°F)'
        }
      }
    };

    res.status(200).json({
      success: true,
      message: 'Emergency preparedness guide for pet owners',
      data: { preparednessInfo }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get emergency services with filters
// @route   GET /api/emergency/services
// @access  Public
router.get('/services', optionalAuth, async (req, res, next) => {
  try {
    const { type, isAvailable24h, currentStatus, services, maxDistance, acceptsInsurance, minRating, lat, lng, radius } = req.query;

    // Mock emergency services data that matches our API design
    let emergencyServices = [
      {
        _id: 'service_1',
        name: 'VetsNow Manchester Emergency Hospital',
        type: 'emergency_clinic',
        description: 'Leading 24/7 emergency veterinary hospital with state-of-the-art facilities and experienced emergency veterinarians.',
        address: {
          street: '789 Emergency Road',
          city: 'Manchester',
          county: 'Greater Manchester',
          postcode: 'M2 3CC',
          country: 'UK'
        },
        location: {
          type: 'Point',
          coordinates: [-2.2426, 53.4794] // [longitude, latitude] format for GeoJSON
        },
        contact: {
          phone: '+441619998888',
          email: 'emergency@vetsnow-manchester.co.uk',
          website: 'https://www.vets-now.com/manchester'
        },
        isAvailable24h: true,
        currentStatus: 'open',
        operatingHours: {
          monday: '24 hours',
          tuesday: '24 hours',
          wednesday: '24 hours',
          thursday: '24 hours',
          friday: '24 hours',
          saturday: '24 hours',
          sunday: '24 hours'
        },
        services: [
          'Emergency surgery',
          'Critical care',
          'Diagnostic imaging',
          'Laboratory services',
          'Poison treatment',
          'Trauma care',
          'Intensive care monitoring'
        ],
        specialties: ['Emergency Surgery', 'Critical Care', 'Toxicology'],
        rating: 4.7,
        reviewCount: 198,
        acceptsInsurance: true,
        acceptsWalkIns: true,
        estimatedWaitTime: '15-30 minutes',
        createdAt: '2023-01-15T10:00:00.000Z',
        updatedAt: '2024-09-13T03:00:00.000Z'
      },
      {
        _id: 'service_2',
        name: 'Animal Emergency Hospital Manchester',
        type: 'veterinary_hospital',
        description: 'Comprehensive emergency and after-hours veterinary care with modern diagnostic equipment.',
        address: {
          street: '456 Urgent Care Street',
          city: 'Manchester',
          county: 'Greater Manchester',
          postcode: 'M3 4DD',
          country: 'UK'
        },
        location: {
          type: 'Point',
          coordinates: [-2.2376, 53.4859]
        },
        contact: {
          phone: '+441618887777',
          email: 'info@animalemergency-manchester.co.uk',
          website: 'https://www.animalemergency-manchester.co.uk'
        },
        isAvailable24h: false,
        currentStatus: 'open',
        operatingHours: {
          monday: '18:00 - 08:00',
          tuesday: '18:00 - 08:00',
          wednesday: '18:00 - 08:00',
          thursday: '18:00 - 08:00',
          friday: '18:00 - 08:00',
          saturday: '24 hours',
          sunday: '24 hours'
        },
        services: [
          'Emergency consultations',
          'X-rays',
          'Blood tests',
          'Minor surgery',
          'Pain management',
          'Wound care'
        ],
        specialties: ['Emergency Medicine', 'Diagnostic Imaging'],
        rating: 4.5,
        reviewCount: 156,
        acceptsInsurance: true,
        acceptsWalkIns: true,
        estimatedWaitTime: '20-45 minutes',
        createdAt: '2023-02-20T14:30:00.000Z',
        updatedAt: '2024-09-13T02:45:00.000Z'
      },
      {
        _id: 'service_3',
        name: 'City Centre Veterinary Emergency',
        type: 'emergency_clinic',
        description: '24-hour emergency clinic specializing in trauma care and cardiac emergencies.',
        address: {
          street: '123 Central Vet Plaza',
          city: 'Manchester',
          county: 'Greater Manchester',
          postcode: 'M1 5EE',
          country: 'UK'
        },
        location: {
          type: 'Point',
          coordinates: [-2.2344, 53.4808]
        },
        contact: {
          phone: '+441617776666',
          email: 'emergency@citycentrevet.co.uk',
          website: 'https://www.citycentrevet.co.uk'
        },
        isAvailable24h: true,
        currentStatus: 'busy',
        operatingHours: {
          monday: '24 hours',
          tuesday: '24 hours',
          wednesday: '24 hours',
          thursday: '24 hours',
          friday: '24 hours',
          saturday: '24 hours',
          sunday: '24 hours'
        },
        services: [
          'Trauma care',
          'Cardiac emergencies',
          'Respiratory support',
          'Intensive care',
          'Emergency dentistry',
          'Ophthalmology emergencies'
        ],
        specialties: ['Cardiac Care', 'Trauma Surgery', 'Emergency Dentistry'],
        rating: 4.8,
        reviewCount: 243,
        acceptsInsurance: true,
        acceptsWalkIns: true,
        estimatedWaitTime: '10-25 minutes',
        createdAt: '2023-03-10T09:15:00.000Z',
        updatedAt: '2024-09-13T03:30:00.000Z'
      }
    ];

    // Apply filters
    if (type) {
      emergencyServices = emergencyServices.filter(service => service.type === type);
    }
    if (isAvailable24h !== undefined) {
      emergencyServices = emergencyServices.filter(service => service.isAvailable24h === (isAvailable24h === 'true'));
    }
    if (currentStatus) {
      emergencyServices = emergencyServices.filter(service => service.currentStatus === currentStatus);
    }
    if (services) {
      const requestedServices = services.split(',');
      emergencyServices = emergencyServices.filter(service => 
        requestedServices.some(reqService => 
          service.services.some(availService => 
            availService.toLowerCase().includes(reqService.toLowerCase())
          )
        )
      );
    }
    if (acceptsInsurance !== undefined) {
      emergencyServices = emergencyServices.filter(service => service.acceptsInsurance === (acceptsInsurance === 'true'));
    }
    if (minRating) {
      emergencyServices = emergencyServices.filter(service => service.rating >= parseFloat(minRating));
    }

    // Calculate distances if coordinates provided
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      
      emergencyServices = emergencyServices.map(service => {
        const distance = calculateDistance(
          [userLng, userLat],
          service.location.coordinates
        );
        return { ...service, distance };
      });

      // Filter by distance if maxDistance provided
      if (maxDistance) {
        emergencyServices = emergencyServices.filter(service => service.distance <= parseFloat(maxDistance));
      }

      // Sort by distance
      emergencyServices.sort((a, b) => a.distance - b.distance);
    }

    const nearestService = emergencyServices.length > 0 ? emergencyServices[0] : null;

    res.status(200).json({
      success: true,
      message: 'Emergency services retrieved successfully',
      data: {
        services: emergencyServices,
        total: emergencyServices.length,
        nearestService
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get nearby emergency services
// @route   GET /api/emergency/services/nearby
// @access  Public
router.get('/services/nearby', optionalAuth, async (req, res, next) => {
  try {
    const { lat, lng, radius = 25 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    // Redirect to main services endpoint with location filters
    req.query.maxDistance = radius;
    return router.handle(req, res, next);
  } catch (error) {
    next(error);
  }
});

// @desc    Get single emergency service
// @route   GET /api/emergency/services/:id
// @access  Public
router.get('/services/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Mock service lookup
    const mockServices = [
      {
        _id: 'service_1',
        name: 'VetsNow Manchester Emergency Hospital',
        type: 'emergency_clinic',
        description: 'Leading 24/7 emergency veterinary hospital with state-of-the-art facilities and experienced emergency veterinarians.',
        address: {
          street: '789 Emergency Road',
          city: 'Manchester',
          county: 'Greater Manchester',
          postcode: 'M2 3CC',
          country: 'UK'
        },
        location: {
          type: 'Point',
          coordinates: [-2.2426, 53.4794]
        },
        contact: {
          phone: '+441619998888',
          email: 'emergency@vetsnow-manchester.co.uk',
          website: 'https://www.vets-now.com/manchester'
        },
        isAvailable24h: true,
        currentStatus: 'open'
      }
    ];

    const service = mockServices.find(s => s._id === id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Emergency service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get emergency requests for user
// @route   GET /api/emergency/requests/my
// @access  Private
router.get('/requests/my', protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    
    // Mock user requests
    let mockRequests = [];
    
    if (status) {
      mockRequests = mockRequests.filter(request => request.status === status);
    }

    res.status(200).json({
      success: true,
      data: mockRequests
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create emergency request
// @route   POST /api/emergency/requests
// @access  Private
router.post('/requests', protect, async (req, res, next) => {
  try {
    const requestData = JSON.parse(req.body.requestData || '{}');
    
    // Mock emergency request creation
    const newRequest = {
      _id: `request_${Date.now()}`,
      userId: req.user.id,
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Emergency request created successfully',
      data: newRequest
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get emergency contacts for user
// @route   GET /api/emergency/contacts
// @access  Private
router.get('/contacts', protect, async (req, res, next) => {
  try {
    // Mock emergency contacts
    const mockContacts = [];

    res.status(200).json({
      success: true,
      data: mockContacts
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add emergency contact
// @route   POST /api/emergency/contacts
// @access  Private
router.post('/contacts', protect, async (req, res, next) => {
  try {
    const contactData = req.body;
    
    // Mock contact creation
    const newContact = {
      _id: `contact_${Date.now()}`,
      userId: req.user.id,
      ...contactData,
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: newContact
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Search poison information
// @route   GET /api/emergency/poison-info
// @access  Public
router.get('/poison-info', optionalAuth, async (req, res, next) => {
  try {
    const { q: query, species } = req.query;
    
    // Mock poison information
    const mockPoisonInfo = [];

    res.status(200).json({
      success: true,
      data: mockPoisonInfo
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get first aid guides
// @route   GET /api/emergency/first-aid
// @access  Public
router.get('/first-aid', optionalAuth, async (req, res, next) => {
  try {
    const { category, species } = req.query;
    
    // Mock first aid guides
    const mockGuides = [];

    res.status(200).json({
      success: true,
      data: mockGuides
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single first aid guide
// @route   GET /api/emergency/first-aid/:id
// @access  Public
router.get('/first-aid/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Mock guide lookup
    const mockGuide = null;
    
    if (!mockGuide) {
      return res.status(404).json({
        success: false,
        error: 'First aid guide not found'
      });
    }

    res.status(200).json({
      success: true,
      data: mockGuide
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to calculate distance between coordinates
function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const dLon = (coord2[0] - coord1[0]) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1[1] * Math.PI / 180) * Math.cos(coord2[1] * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;