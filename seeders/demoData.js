/**
 * Demo Data Seeder for Pet Care Platform
 * Creates sample users, pets, services, and other demo content
 */

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const Pet = require('../models/Pet');

// Demo Users Data
const demoUsers = [
  {
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@petcare.uk',
    password: 'admin123',
    role: 'admin',
    phone: '07700900123',
    isVerified: true,
    bio: 'Super Administrator of Pet Care Platform',
    address: {
      street: '123 Admin Street',
      city: 'London',
      county: 'Greater London', 
      postcode: 'SW1 1AA',
      country: 'United Kingdom'
    },
    location: {
      type: 'Point',
      coordinates: [-0.1276, 51.5074] // London coordinates
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    password: 'user123',
    role: 'user',
    phone: '07700900124',
    isVerified: true,
    bio: 'Dog lover and pet enthusiast from Manchester',
    address: {
      street: '45 Pet Lane',
      city: 'Manchester',
      county: 'Greater Manchester',
      postcode: 'M1 2AB',
      country: 'United Kingdom'
    },
    location: {
      type: 'Point',
      coordinates: [-2.2426, 53.4808]
    }
  },
  {
    firstName: 'Dr. James',
    lastName: 'Wilson',
    email: 'james.wilson@vetcare.uk',
    password: 'vet123',
    role: 'vet',
    phone: '07700900125',
    isVerified: true,
    bio: 'Experienced veterinarian specializing in small animals',
    businessName: 'Wilson Veterinary Clinic',
    businessLicense: 'VET123456',
    serviceTypes: ['veterinary'],
    hourlyRate: 85,
    address: {
      street: '78 Vet Road',
      city: 'Birmingham',
      county: 'West Midlands',
      postcode: 'B1 3CD',
      country: 'United Kingdom'
    },
    location: {
      type: 'Point',
      coordinates: [-1.8904, 52.4862]
    },
    averageRating: 4.8,
    totalReviews: 156
  },
  {
    firstName: 'Emma',
    lastName: 'Thompson',
    email: 'emma@pawsitters.uk',
    password: 'provider123',
    role: 'service_provider',
    phone: '07700900126',
    isVerified: true,
    bio: 'Professional pet sitter and dog walker with 5 years experience',
    businessName: 'Paw Sitters UK',
    businessLicense: 'PS789012',
    serviceTypes: ['pet_sitting', 'dog_walking'],
    hourlyRate: 25,
    serviceRadius: 15,
    address: {
      street: '12 Walker Street',
      city: 'Leeds',
      county: 'West Yorkshire',
      postcode: 'LS1 4EF',
      country: 'United Kingdom'
    },
    location: {
      type: 'Point',
      coordinates: [-1.5491, 53.8008]
    },
    averageRating: 4.6,
    totalReviews: 89
  },
  {
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael@groomingpro.uk',
    password: 'groomer123',
    role: 'service_provider',
    phone: '07700900127',
    isVerified: true,
    bio: 'Award-winning pet groomer specializing in show dogs',
    businessName: 'Pro Pet Grooming',
    businessLicense: 'GR345678',
    serviceTypes: ['grooming'],
    hourlyRate: 45,
    serviceRadius: 20,
    address: {
      street: '89 Grooming Avenue',
      city: 'Bristol',
      county: 'Bristol',
      postcode: 'BS1 5GH',
      country: 'United Kingdom'
    },
    location: {
      type: 'Point',
      coordinates: [-2.5879, 51.4545]
    },
    averageRating: 4.9,
    totalReviews: 203
  },
  {
    firstName: 'Happy Tails',
    lastName: 'Rescue',
    email: 'contact@happytails.uk',
    password: 'rescue123',
    role: 'rescue_center',
    phone: '07700900128',
    isVerified: true,
    bio: 'Dedicated rescue center helping pets find loving homes',
    businessName: 'Happy Tails Animal Rescue',
    businessLicense: 'RC456789',
    address: {
      street: '101 Rescue Road',
      city: 'Liverpool',
      county: 'Merseyside',
      postcode: 'L1 6IJ',
      country: 'United Kingdom'
    },
    location: {
      type: 'Point',
      coordinates: [-2.9916, 53.4084]
    }
  }
];

// Demo Pets Data
const demoPets = [
  {
    name: 'Bella',
    species: 'dog',
    breed: 'Golden Retriever',
    dateOfBirth: new Date('2020-05-15'),
    gender: 'female',
    weight: {
      current: 28.5,
      unit: 'kg'
    },
    size: 'large',
    color: 'Golden',
    microchipId: 'UK123456789012345',
    description: 'Friendly and energetic golden retriever who loves playing fetch and swimming',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
        caption: 'Bella playing in the park',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
        caption: 'Bella at home'
      }
    ],
    health: {
      isSpayedNeutered: true,
      allergies: []
    },
    emergencyContact: {
      name: 'John Johnson',
      phone: '07700900129',
      relationship: 'Partner'
    }
  },
  {
    name: 'Whiskers',
    species: 'cat',
    breed: 'British Shorthair',
    dateOfBirth: new Date('2021-08-22'),
    gender: 'male',
    weight: {
      current: 5.2,
      unit: 'kg'
    },
    size: 'medium',
    color: 'Blue',
    microchipId: 'UK987654321098765',
    description: 'Calm and affectionate cat who enjoys sunny windowsills and gentle pets',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop',
        caption: 'Whiskers lounging',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=400&fit=crop',
        caption: 'Whiskers in sunlight'
      }
    ],
    health: {
      isSpayedNeutered: true,
      allergies: [{
        allergen: 'Chicken protein',
        severity: 'mild'
      }]
    },
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '07700900124',
      relationship: 'Owner'
    }
  },
  {
    name: 'Rex',
    species: 'dog',
    breed: 'German Shepherd',
    dateOfBirth: new Date('2019-03-10'),
    gender: 'male',
    weight: {
      current: 35.8,
      unit: 'kg'
    },
    size: 'large',
    color: 'Black and Tan',
    microchipId: 'UK555666777888999',
    description: 'Intelligent and loyal working dog, great with children and protective of family',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=400&fit=crop',
        caption: 'Rex on duty',
        isPrimary: true
      }
    ],
    health: {
      isSpayedNeutered: true,
      conditions: [{
        name: 'Hip dysplasia',
        status: 'chronic',
        notes: 'Mild condition, requires monitoring'
      }],
      allergies: [{
        allergen: 'Beef',
        severity: 'moderate'
      }]
    },
    behavior: {
      specialNeeds: ['Requires joint supplements']
    }
  }
];

// Seeder Functions
const seedUsers = async () => {
  try {
    console.log('🌱 Seeding demo users...');
    
    // Clear existing demo users (optional)
    await User.deleteMany({ 
      email: { $in: demoUsers.map(user => user.email) }
    });
    
    // Create users (mongoose will hash passwords automatically)
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.firstName} ${userData.lastName} (${userData.role})`);
    }
    
    console.log('✅ Users seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
};

const seedPets = async () => {
  try {
    console.log('🐕 Seeding demo pets...');
    
    // Get demo users to assign pets to them
    const sarah = await User.findOne({ email: 'sarah@example.com' });
    const admin = await User.findOne({ email: 'admin@petcare.uk' });
    const emma = await User.findOne({ email: 'emma@pawsitters.uk' });
    
    if (!sarah || !admin || !emma) {
      throw new Error('Demo users not found. Please seed users first.');
    }
    
    // Assign pets to users
    demoPets[0].owner = sarah._id; // Bella to Sarah
    demoPets[1].owner = sarah._id; // Whiskers to Sarah
    demoPets[2].owner = admin._id; // Rex to Admin
    
    // Clear existing demo pets (optional)
    await Pet.deleteMany({ 
      name: { $in: demoPets.map(pet => pet.name) }
    });
    
    // Create pets
    for (const petData of demoPets) {
      const pet = new Pet(petData);
      await pet.save();
      console.log(`✅ Created pet: ${petData.name} (${petData.species})`);
    }
    
    console.log('✅ Pets seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding pets:', error.message);
    throw error;
  }
};

const seedAll = async () => {
  try {
    console.log('🚀 Starting demo data seeding...\n');
    
    await seedUsers();
    console.log('');
    await seedPets();
    
    console.log('\n🎉 All demo data seeded successfully!');
    console.log('\n📋 Demo Accounts Created:');
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ SUPER ADMIN                                                 │');
    console.log('│ Email: admin@petcare.uk                                     │');
    console.log('│ Password: admin123                                          │');
    console.log('│ Role: admin                                                 │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ REGULAR USER (Pet Owner)                                    │');
    console.log('│ Email: sarah@example.com                                    │');
    console.log('│ Password: user123                                           │');
    console.log('│ Role: user                                                  │');
    console.log('│ Pets: Bella (Golden Retriever), Whiskers (British Shorthair)│');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ VETERINARIAN                                                │');
    console.log('│ Email: james.wilson@vetcare.uk                              │');
    console.log('│ Password: vet123                                            │');
    console.log('│ Role: vet                                                   │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ SERVICE PROVIDER (Pet Sitter)                              │');
    console.log('│ Email: emma@pawsitters.uk                                   │');
    console.log('│ Password: provider123                                       │');
    console.log('│ Role: service_provider                                      │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ SERVICE PROVIDER (Groomer)                                 │');
    console.log('│ Email: michael@groomingpro.uk                               │');
    console.log('│ Password: groomer123                                        │');
    console.log('│ Role: service_provider                                      │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    console.log('│ RESCUE CENTER                                               │');
    console.log('│ Email: contact@happytails.uk                                │');
    console.log('│ Password: rescue123                                         │');
    console.log('│ Role: rescue_center                                         │');
    console.log('└─────────────────────────────────────────────────────────────┘');
    console.log('\n🌐 Access your platform at: http://localhost:3002');
    console.log('📊 Admin panel at: http://localhost:3001 (when started)');
    
  } catch (error) {
    console.error('\n❌ Demo data seeding failed:', error.message);
    process.exit(1);
  }
};

// Export functions
module.exports = {
  seedUsers,
  seedPets,
  seedAll,
  demoUsers,
  demoPets
};

// Run if called directly
if (require.main === module) {
  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare';
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('📂 Connected to MongoDB');
      return seedAll();
    })
    .then(() => {
      console.log('\n✨ Demo data seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}