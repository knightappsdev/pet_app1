/**
 * User Model
 * Represents pet owners, service providers, and admin users
 */

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  
  // Profile Information
  phone: {
    type: String,
    match: [/^(\+44|0)[1-9]\d{8,9}$/, 'Please add a valid UK phone number']
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  dateOfBirth: Date,
  
  // Location
  address: {
    street: String,
    city: String,
    county: String,
    postcode: {
      type: String,
      match: [/^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i, 'Please add a valid UK postcode']
    },
    country: {
      type: String,
      default: 'United Kingdom'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    }
  },
  
  // User Role and Status
  role: {
    type: String,
    enum: ['user', 'service_provider', 'vet', 'rescue_center', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Service Provider Specific Fields
  businessName: String,
  businessLicense: String,
  serviceTypes: [{
    type: String,
    enum: ['dog_walking', 'pet_sitting', 'grooming', 'training', 'veterinary', 'boarding']
  }],
  serviceRadius: {
    type: Number,
    default: 10 // miles
  },
  hourlyRate: Number,
  
  // Ratings and Reviews
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
      showLocation: { type: Boolean, default: true },
      showPhone: { type: Boolean, default: false }
    },
    language: {
      type: String,
      default: 'en-GB'
    },
    currency: {
      type: String,
      default: 'GBP'
    }
  },
  
  // Security
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Timestamps
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for location-based queries
UserSchema.index({ location: '2dsphere' });
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ email: 1 });

// Update updatedAt on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Encrypt password using bcryptjs
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Generate password reset token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = require('crypto').randomBytes(20).toString('hex');

  // Hash token and set to passwordResetToken field
  this.passwordResetToken = require('crypto')
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for formatted address
UserSchema.virtual('formattedAddress').get(function() {
  if (!this.address) return '';
  const { street, city, county, postcode } = this.address;
  return [street, city, county, postcode].filter(Boolean).join(', ');
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);