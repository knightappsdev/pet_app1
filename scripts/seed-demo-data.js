#!/usr/bin/env node

/**
 * Demo Data Seeder Script
 * Run this script to populate the database with demo users and pets
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { seedAll } = require('../seeders/demoData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/petcare';

console.log('🚀 Pet Care Platform - Demo Data Seeder');
console.log('========================================\n');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    console.log(`📍 Database: ${MONGODB_URI}\n`);
    return seedAll();
  })
  .then(() => {
    console.log('\n🎊 Demo data seeding completed successfully!');
    console.log('\n🔗 Next steps:');
    console.log('   1. Visit http://localhost:3002 to access the PWA');
    console.log('   2. Log in with any of the demo accounts above');
    console.log('   3. Explore all the features with pre-populated data!');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error.message);
    mongoose.connection.close();
    process.exit(1);
  });