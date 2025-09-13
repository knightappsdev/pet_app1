/**
 * Health Routes
 * Handles pet health records, vet appointments, and wellness tracking
 */

const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get health dashboard
// @route   GET /api/health-records
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const healthDashboard = {
      upcomingAppointments: [],
      vaccinationReminders: [],
      medicationReminders: [],
      recentVisits: [],
      healthAlerts: []
    };

    res.status(200).json({
      success: true,
      message: 'Pet health & wellness dashboard',
      data: { healthDashboard }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Book vet appointment
// @route   POST /api/health-records/appointments
// @access  Private
router.post('/appointments', protect, async (req, res, next) => {
  try {
    const { petId, vetId, date, reason, type } = req.body;

    res.status(201).json({
      success: true,
      message: 'Vet appointment booked successfully',
      data: {
        appointment: {
          id: 'apt_' + Date.now(),
          petId,
          vetId,
          date,
          reason,
          type,
          status: 'confirmed',
          createdAt: new Date()
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get health records for a pet or user
// @route   GET /api/health/records
// @access  Private
router.get('/records', protect, async (req, res, next) => {
  try {
    const { petId } = req.query
    
    // Mock health records data
    const healthRecords = [
      {
        id: 'record_1',
        pet: petId || 'pet_1',
        date: new Date('2024-09-01'),
        type: 'checkup',
        vetName: 'Dr. Sarah Johnson',
        vetClinic: 'Manchester Pet Hospital',
        diagnosis: 'Routine health check - all normal',
        treatment: 'Annual vaccination booster',
        medications: 'Flea and tick prevention',
        notes: 'Pet is in excellent health. Weight is ideal.',
        cost: 85.50,
        attachments: [],
        createdAt: '2024-09-01T10:00:00.000Z',
        updatedAt: '2024-09-01T10:00:00.000Z'
      },
      {
        id: 'record_2', 
        pet: petId || 'pet_1',
        date: new Date('2024-06-15'),
        type: 'illness',
        vetName: 'Dr. Mark Wilson',
        vetClinic: 'City Vet Clinic',
        diagnosis: 'Mild ear infection',
        treatment: 'Antibiotic ear drops prescribed',
        medications: 'Surolan ear drops - 2 drops twice daily for 7 days',
        notes: 'Follow up in 1 week if symptoms persist',
        followUpDate: new Date('2024-06-22'),
        cost: 65.00,
        attachments: [],
        createdAt: '2024-06-15T14:30:00.000Z',
        updatedAt: '2024-06-15T14:30:00.000Z'
      }
    ]

    res.status(200).json({
      success: true,
      message: 'Health records retrieved successfully',
      data: petId ? healthRecords.filter(r => r.pet === petId) : healthRecords
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Add new health record
// @route   POST /api/health/records
// @access  Private
router.post('/records', protect, async (req, res, next) => {
  try {
    // Mock health record creation
    const newRecord = {
      id: `record_${Date.now()}`,
      ...req.body,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    res.status(201).json({
      success: true,
      message: 'Health record added successfully',
      data: newRecord
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get vaccination records
// @route   GET /api/health/vaccinations
// @access  Private
router.get('/vaccinations', protect, async (req, res, next) => {
  try {
    const { petId } = req.query
    
    // Mock vaccination records
    const vaccinations = [
      {
        id: 'vacc_1',
        pet: petId || 'pet_1',
        vaccineName: 'Annual Booster (DHPP)',
        dateGiven: '2024-09-01',
        nextDueDate: '2025-09-01',
        vetName: 'Dr. Sarah Johnson',
        batchNumber: 'VB2024-001',
        createdAt: '2024-09-01T10:00:00.000Z',
        updatedAt: '2024-09-01T10:00:00.000Z'
      },
      {
        id: 'vacc_2',
        pet: petId || 'pet_1', 
        vaccineName: 'Rabies',
        dateGiven: '2024-09-01',
        nextDueDate: '2027-09-01',
        vetName: 'Dr. Sarah Johnson',
        batchNumber: 'RV2024-005',
        createdAt: '2024-09-01T10:15:00.000Z',
        updatedAt: '2024-09-01T10:15:00.000Z'
      }
    ]

    res.status(200).json({
      success: true,
      message: 'Vaccination records retrieved successfully',
      data: petId ? vaccinations.filter(v => v.pet === petId) : vaccinations
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get upcoming vaccinations
// @route   GET /api/health/vaccinations/upcoming
// @access  Private
router.get('/vaccinations/upcoming', protect, async (req, res, next) => {
  try {
    const { petId } = req.query
    
    // Mock upcoming vaccinations
    const upcomingVaccinations = [
      {
        id: 'vacc_upcoming_1',
        pet: petId || 'pet_1',
        vaccineName: 'Kennel Cough',
        dateGiven: '2024-03-01',
        nextDueDate: '2025-03-01',
        vetName: 'Dr. Sarah Johnson',
        batchNumber: 'KC2024-003',
        createdAt: '2024-03-01T09:00:00.000Z',
        updatedAt: '2024-03-01T09:00:00.000Z'
      }
    ]

    res.status(200).json({
      success: true,
      message: 'Upcoming vaccinations retrieved successfully',
      data: petId ? upcomingVaccinations.filter(v => v.pet === petId) : upcomingVaccinations
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get health reminders
// @route   GET /api/health/reminders
// @access  Private
router.get('/reminders', protect, async (req, res, next) => {
  try {
    const { petId } = req.query
    
    // Mock health reminders
    const reminders = []

    res.status(200).json({
      success: true,
      message: 'Health reminders retrieved successfully',
      data: petId ? reminders.filter(r => r.petId === petId) : reminders
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get upcoming health reminders
// @route   GET /api/health/reminders/upcoming
// @access  Private
router.get('/reminders/upcoming', protect, async (req, res, next) => {
  try {
    const { days = 30 } = req.query
    
    // Mock upcoming reminders
    const upcomingReminders = []

    res.status(200).json({
      success: true,
      message: 'Upcoming reminders retrieved successfully',
      data: upcomingReminders
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get nearby veterinarians
// @route   GET /api/health/vets
// @access  Private 
router.get('/vets', protect, async (req, res, next) => {
  try {
    const { lat, lng, radius = 25 } = req.query
    
    // Mock veterinarian listings
    const vets = [
      {
        _id: 'vet_1',
        name: 'Dr. Sarah Johnson',
        clinicName: 'Manchester Pet Hospital',
        specialties: ['General Practice', 'Surgery', 'Dermatology'],
        qualifications: ['BVSc', 'MRCVS'],
        yearsExperience: 12,
        contact: {
          phone: '+441612345678',
          email: 'sarah.johnson@manchesterpet.co.uk',
          website: 'https://manchesterpet.co.uk'
        },
        address: {
          street: '123 Vet Street',
          city: 'Manchester',
          county: 'Greater Manchester', 
          postcode: 'M1 2AB',
          country: 'UK'
        },
        location: {
          coordinates: [-2.2426, 53.4794]
        },
        services: {
          consultations: true,
          surgery: true,
          diagnostics: true,
          emergency: false,
          houseCalls: true,
          grooming: false
        },
        pricing: {
          consultationFee: 65,
          currency: 'GBP',
          acceptsInsurance: true
        },
        ratings: {
          average: 4.8,
          count: 156,
          reviews: []
        },
        isVerified: true,
        isAcceptingNewPatients: true,
        createdAt: '2023-01-15T10:00:00.000Z',
        updatedAt: '2024-09-13T12:00:00.000Z'
      }
    ]

    res.status(200).json({
      success: true,
      message: 'Nearby veterinarians retrieved successfully',
      data: vets
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user's vet appointments
// @route   GET /api/health/appointments/my
// @access  Private
router.get('/appointments/my', protect, async (req, res, next) => {
  try {
    const { status } = req.query
    
    // Mock appointments
    const appointments = []

    res.status(200).json({
      success: true,
      message: 'User appointments retrieved successfully',
      data: status ? appointments.filter(a => a.status === status) : appointments
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Book vet appointment  
// @route   POST /api/health/appointments
// @access  Private
router.post('/appointments', protect, async (req, res, next) => {
  try {
    const appointmentData = req.body
    
    // Mock appointment creation
    const newAppointment = {
      _id: `appointment_${Date.now()}`,
      userId: req.user.id,
      ...appointmentData,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    res.status(201).json({
      success: true,
      message: 'Vet appointment booked successfully',
      data: newAppointment
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get health statistics
// @route   GET /api/health/stats/:petId
// @access  Private
router.get('/stats/:petId', protect, async (req, res, next) => {
  try {
    const { petId } = req.params
    const { period } = req.query
    
    // Mock health statistics
    const healthStats = {
      totalRecords: 5,
      recentCheckups: 1,
      vaccinationsUpToDate: 2, 
      upcomingReminders: 0,
      healthScore: 92
    }

    res.status(200).json({
      success: true,
      message: 'Health statistics retrieved successfully',
      data: healthStats
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get health insights
// @route   GET /api/health/insights/:petId
// @access  Private
router.get('/insights/:petId', protect, async (req, res, next) => {
  try {
    const { petId } = req.params
    
    // Mock health insights
    const insights = []

    res.status(200).json({
      success: true,
      message: 'Health insights retrieved successfully',
      data: insights
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router;