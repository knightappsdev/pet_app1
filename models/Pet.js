/**
 * Pet Model
 * Represents pets with comprehensive health, behavior, and profile information
 */

const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please add a pet name'],
    trim: true,
    maxlength: [50, 'Pet name cannot be more than 50 characters']
  },
  species: {
    type: String,
    required: [true, 'Please specify pet species'],
    enum: ['dog', 'cat', 'rabbit', 'bird', 'fish', 'hamster', 'guinea_pig', 'reptile', 'other'],
    lowercase: true
  },
  breed: {
    type: String,
    required: [true, 'Please specify pet breed'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please add date of birth']
  },
  color: {
    type: String,
    trim: true
  },
  
  // Physical Characteristics
  weight: {
    current: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'lbs'],
      default: 'kg'
    },
    history: [{
      weight: Number,
      date: { type: Date, default: Date.now },
      notes: String
    }]
  },
  height: {
    type: Number,
    min: 0 // in centimeters
  },
  size: {
    type: String,
    enum: ['extra_small', 'small', 'medium', 'large', 'extra_large'],
    required: true
  },
  
  // Identification
  microchipId: {
    type: String,
    unique: true,
    sparse: true
  },
  registrationNumber: String,
  insuranceNumber: String,
  
  // Owner Information
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  
  // Photos
  photos: [{
    url: {
      type: String,
      default: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop'
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Health Information
  health: {
    // Medical Conditions
    conditions: [{
      name: { type: String, required: true },
      diagnosedDate: Date,
      status: { type: String, enum: ['active', 'resolved', 'chronic'], default: 'active' },
      notes: String,
      veterinarian: String
    }],
    
    // Allergies
    allergies: [{
      allergen: { type: String, required: true },
      severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild' },
      symptoms: [String],
      notes: String
    }],
    
    // Current Medications
    medications: [{
      name: { type: String, required: true },
      dosage: String,
      frequency: String,
      startDate: { type: Date, required: true },
      endDate: Date,
      prescribedBy: String,
      notes: String,
      isActive: { type: Boolean, default: true }
    }],
    
    // Vaccinations
    vaccinations: [{
      vaccine: { type: String, required: true },
      dateGiven: { type: Date, required: true },
      nextDue: Date,
      veterinarian: String,
      batchNumber: String,
      notes: String
    }],
    
    // Veterinary Records
    vetVisits: [{
      date: { type: Date, required: true },
      veterinarian: String,
      clinic: String,
      reason: String,
      diagnosis: String,
      treatment: String,
      followUp: Date,
      cost: Number,
      notes: String
    }],
    
    // Spay/Neuter Status
    isSpayedNeutered: {
      type: Boolean,
      default: false
    },
    spayNeuterDate: Date
  },
  
  // Behavior and Temperament
  behavior: {
    temperament: [{
      type: String,
      enum: ['friendly', 'aggressive', 'anxious', 'playful', 'calm', 'energetic', 'shy', 'confident', 'protective']
    }],
    
    // Good with
    goodWith: {
      children: { type: String, enum: ['yes', 'no', 'unknown'], default: 'unknown' },
      dogs: { type: String, enum: ['yes', 'no', 'unknown'], default: 'unknown' },
      cats: { type: String, enum: ['yes', 'no', 'unknown'], default: 'unknown' },
      strangers: { type: String, enum: ['yes', 'no', 'unknown'], default: 'unknown' }
    },
    
    // Training
    training: {
      housebroken: { type: Boolean, default: false },
      obedienceLevel: { type: String, enum: ['none', 'basic', 'intermediate', 'advanced'], default: 'none' },
      commands: [String],
      behaviorIssues: [String],
      trainingNotes: String
    },
    
    // Activity Level
    activityLevel: {
      type: String,
      enum: ['very_low', 'low', 'moderate', 'high', 'very_high'],
      default: 'moderate'
    },
    
    // Special Needs
    specialNeeds: [String],
    notes: String
  },
  
  // Diet and Nutrition
  diet: {
    currentFood: {
      brand: String,
      type: { type: String, enum: ['dry', 'wet', 'raw', 'mixed'] },
      amount: String,
      frequency: String
    },
    
    feedingSchedule: [{
      time: String,
      amount: String,
      food: String
    }],
    
    dietaryRestrictions: [String],
    treats: [String],
    notes: String
  },
  
  // Care Preferences
  carePreferences: {
    preferredVet: {
      name: String,
      clinic: String,
      phone: String,
      address: String
    },
    
    groomingNeeds: {
      frequency: String,
      specialInstructions: String,
      lastGroomed: Date
    },
    
    exerciseNeeds: {
      duration: String, // e.g., "30 minutes daily"
      type: [String], // e.g., ["walking", "running", "playing"]
      restrictions: String
    },
    
    socialPreferences: {
      dogParks: { type: Boolean, default: true },
      groupWalks: { type: Boolean, default: true },
      playdates: { type: Boolean, default: true }
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'lost', 'found', 'deceased', 'rehomed'],
    default: 'active'
  },
  
  // Adoption Information (if applicable)
  adoption: {
    isAvailable: { type: Boolean, default: false },
    rescueCenter: { type: mongoose.Schema.ObjectId, ref: 'User' },
    adoptionFee: Number,
    story: String,
    requirements: [String],
    postedDate: Date
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
PetSchema.index({ owner: 1 });
PetSchema.index({ species: 1, breed: 1 });
PetSchema.index({ status: 1 });
PetSchema.index({ 'adoption.isAvailable': 1 });
PetSchema.index({ microchipId: 1 });

// Update updatedAt on save
PetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for age calculation
PetSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for primary photo
PetSchema.virtual('primaryPhoto').get(function() {
  const primary = this.photos.find(photo => photo.isPrimary);
  return primary ? primary.url : (this.photos[0] ? this.photos[0].url : 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop');
});

// Virtual for next vaccination due
PetSchema.virtual('nextVaccinationDue').get(function() {
  if (!this.health.vaccinations.length) return null;
  
  const upcomingVaccinations = this.health.vaccinations
    .filter(vac => vac.nextDue && vac.nextDue > new Date())
    .sort((a, b) => a.nextDue - b.nextDue);
    
  return upcomingVaccinations.length > 0 ? upcomingVaccinations[0] : null;
});

// Virtual for health summary
PetSchema.virtual('healthSummary').get(function() {
  return {
    hasConditions: this.health.conditions.filter(c => c.status === 'active').length > 0,
    hasAllergies: this.health.allergies.length > 0,
    onMedication: this.health.medications.filter(m => m.isActive).length > 0,
    vaccinationsUpToDate: this.health.vaccinations.length > 0,
    isSpayedNeutered: this.health.isSpayedNeutered
  };
});

// Ensure virtual fields are serialized
PetSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Pet', PetSchema);