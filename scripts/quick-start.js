#!/usr/bin/env node

/**
 * Pet Care Platform - Quick Start Setup Script
 * This script helps set up the development environment quickly
 */

const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

console.log('🚀 Pet Care Platform - Quick Start Setup');
console.log('=========================================\n');

const steps = [
  {
    name: 'Environment Setup',
    description: 'Creating environment files from templates',
    action: setupEnvironment
  },
  {
    name: 'Dependencies Check',
    description: 'Checking if Node.js and npm are available',
    action: checkDependencies
  },
  {
    name: 'MongoDB Check',
    description: 'Checking MongoDB connection',
    action: checkMongoDB
  },
  {
    name: 'Package Installation',
    description: 'Installing npm dependencies (this may take a while)',
    action: installPackages
  },
  {
    name: 'Demo Data Setup',
    description: 'Setting up demo data and user accounts',
    action: setupDemoData
  }
];

async function main() {
  console.log('This script will help you set up the Pet Care Platform development environment.\n');
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`📋 Step ${i + 1}/${steps.length}: ${step.name}`);
    console.log(`   ${step.description}`);
    
    try {
      await step.action();
      console.log('   ✅ Completed\n');
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}\n`);
      console.log('Please check the error above and try running the setup manually.');
      console.log('See VSCODE_LOCAL_DEPLOYMENT.md for detailed instructions.');
      process.exit(1);
    }
  }
  
  console.log('🎉 Setup completed successfully!\n');
  console.log('📋 Next Steps:');
  console.log('1. Open 3 terminal windows in VS Code');
  console.log('2. Terminal 1: npm run dev (API Server)');
  console.log('3. Terminal 2: cd pwa && npm run dev (PWA)');
  console.log('4. Terminal 3: cd admin && npm run dev (Admin Dashboard)');
  console.log('\n🌐 Access URLs:');
  console.log('• API: http://localhost:3000');
  console.log('• PWA: http://localhost:3002');
  console.log('• Admin: http://localhost:3001');
  console.log('\n🔑 Demo Accounts:');
  console.log('• Super Admin: admin@petcare.uk / admin123');
  console.log('• Pet Owner: sarah@example.com / user123');
  console.log('• Veterinarian: james.wilson@vetcare.uk / vet123');
  console.log('\nHappy coding! 🐾');
}

function setupEnvironment() {
  return new Promise((resolve, reject) => {
    try {
      // Copy main .env file
      const envExample = path.join(__dirname, '..', '.env.example');
      const envFile = path.join(__dirname, '..', '.env');
      
      if (!fs.existsSync(envFile) && fs.existsSync(envExample)) {
        fs.copyFileSync(envExample, envFile);
        console.log('   📄 Created .env from template');
      }
      
      // Copy PWA .env.local file
      const pwaEnvExample = path.join(__dirname, '..', 'pwa', '.env.local.example');
      const pwaEnvFile = path.join(__dirname, '..', 'pwa', '.env.local');
      
      if (!fs.existsSync(pwaEnvFile) && fs.existsSync(pwaEnvExample)) {
        fs.copyFileSync(pwaEnvExample, pwaEnvFile);
        console.log('   📄 Created pwa/.env.local from template');
      }
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function checkDependencies() {
  return new Promise((resolve, reject) => {
    exec('node --version', (error, stdout) => {
      if (error) {
        reject(new Error('Node.js is not installed. Please install Node.js from https://nodejs.org/'));
        return;
      }
      
      const nodeVersion = stdout.trim();
      console.log(`   ✅ Node.js version: ${nodeVersion}`);
      
      exec('npm --version', (error, stdout) => {
        if (error) {
          reject(new Error('npm is not available. Please install Node.js which includes npm.'));
          return;
        }
        
        const npmVersion = stdout.trim();
        console.log(`   ✅ npm version: ${npmVersion}`);
        resolve();
      });
    });
  });
}

function checkMongoDB() {
  return new Promise((resolve, reject) => {
    exec('mongo --eval "db.adminCommand(\'ismaster\')" --quiet', (error, stdout, stderr) => {
      if (error) {
        console.log('   ⚠️  Local MongoDB not found. You can:');
        console.log('     • Install MongoDB locally, or');
        console.log('     • Use MongoDB Atlas (cloud) - update MONGODB_URI in .env');
        console.log('     • Continue setup and configure database later');
      } else {
        console.log('   ✅ MongoDB is running locally');
      }
      resolve(); // Don't fail on MongoDB check, as Atlas is an option
    });
  });
}

function installPackages() {
  return new Promise((resolve, reject) => {
    console.log('   📦 Installing main project dependencies...');
    
    const mainInstall = spawn('npm', ['install'], { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    
    mainInstall.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('Failed to install main project dependencies'));
        return;
      }
      
      console.log('   📦 Installing PWA dependencies...');
      
      const pwaInstall = spawn('npm', ['install'], {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..', 'pwa')
      });
      
      pwaInstall.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Failed to install PWA dependencies'));
          return;
        }
        
        console.log('   📦 Installing Admin dependencies...');
        
        const adminInstall = spawn('npm', ['install'], {
          stdio: 'pipe',
          cwd: path.join(__dirname, '..', 'admin')
        });
        
        adminInstall.on('close', (code) => {
          if (code !== 0) {
            reject(new Error('Failed to install Admin dependencies'));
            return;
          }
          
          resolve();
        });
      });
    });
  });
}

function setupDemoData() {
  return new Promise((resolve, reject) => {
    console.log('   🌱 Setting up demo data...');
    
    const seedScript = spawn('node', ['scripts/seed-demo-data.js'], {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    
    let output = '';
    seedScript.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    seedScript.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    seedScript.on('close', (code) => {
      if (code !== 0) {
        console.log('   ⚠️  Demo data setup failed. You can run it manually later:');
        console.log('     node scripts/seed-demo-data.js');
        console.log('   Make sure MongoDB is running and MONGODB_URI is correct in .env');
      } else {
        console.log('   ✅ Demo data created successfully');
      }
      resolve(); // Don't fail setup if demo data fails
    });
  });
}

// Handle script interruption
process.on('SIGINT', () => {
  console.log('\n\n⚠️  Setup interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️  Setup terminated');
  process.exit(1);
});

// Run the setup
main().catch(console.error);