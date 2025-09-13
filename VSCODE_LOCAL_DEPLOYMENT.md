# 🚀 VS Code Local Deployment Guide
## Pet Care & Support Platform - Complete Setup

This guide will help you deploy the Pet Care Platform on your local machine using VS Code.

## 📋 Prerequisites

Before starting, ensure you have these installed on your computer:

### Required Software:
1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (Community Edition)
   - Download: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

3. **Git**
   - Download: https://git-scm.com/downloads
   - Verify: `git --version`

4. **Visual Studio Code**
   - Download: https://code.visualstudio.com/

### Recommended VS Code Extensions:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **ESLint**
- **MongoDB for VS Code**
- **Thunder Client** (for API testing)
- **Auto Rename Tag**
- **Bracket Pair Colorizer**

---

## 🎯 Step-by-Step Deployment

### Step 1: Clone the Repository

1. **Open VS Code**
2. **Open Terminal** (`Ctrl+` ` or `View > Terminal`)
3. **Navigate to your desired project folder:**
   ```bash
   cd Desktop
   # or wherever you want to store the project
   ```

4. **Clone the repository:**
   ```bash
   git clone https://github.com/knightappsdev/pet_app1.git
   cd pet_app1
   ```

5. **Open the project in VS Code:**
   ```bash
   code .
   ```

### Step 2: Install Dependencies

1. **In VS Code Terminal, install backend dependencies:**
   ```bash
   npm install
   ```

2. **Install PWA dependencies:**
   ```bash
   cd pwa
   npm install
   cd ..
   ```

3. **Install Admin dashboard dependencies:**
   ```bash
   cd admin
   npm install
   cd ..
   ```

### Step 3: Set Up MongoDB

#### Option A: Local MongoDB Installation
1. **Start MongoDB service:**
   - **Windows**: Start MongoDB as a service or run `mongod`
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

2. **Verify MongoDB is running:**
   ```bash
   mongo --eval "db.adminCommand('ismaster')"
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. **Create free account** at https://mongodb.com/atlas
2. **Create a new cluster** (free tier available)
3. **Get connection string** from Atlas dashboard
4. **Whitelist your IP address** in Atlas security settings

### Step 4: Environment Configuration

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file in VS Code:**
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3000

   # Database Configuration
   # For Local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/petcare

   # For MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/petcare?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Email Configuration (Optional - for production)
   EMAIL_FROM=noreply@petcare.uk
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USERNAME=your-email-username
   EMAIL_PASSWORD=your-email-password

   # File Upload Configuration
   MAX_FILE_UPLOAD=1000000
   FILE_UPLOAD_PATH=./public/uploads

   # Frontend URLs
   CLIENT_URL=http://localhost:3002
   ADMIN_URL=http://localhost:3001
   ```

3. **Create PWA environment file:**
   ```bash
   cd pwa
   cp .env.local.example .env.local
   ```

4. **Edit `pwa/.env.local`:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_APP_NAME=Pet Care Platform
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

### Step 5: Set Up Demo Data

1. **In the main terminal, seed demo data:**
   ```bash
   node scripts/seed-demo-data.js
   ```

2. **You should see output like:**
   ```
   ✅ Connected to MongoDB successfully!
   🌱 Seeding demo users...
   ✅ Created user: Super Admin (admin)
   ✅ Created user: Sarah Johnson (user)
   ...
   🐕 Seeding demo pets...
   ✅ Created pet: Bella (dog)
   ✅ Created pet: Whiskers (cat)
   ✅ Created pet: Rex (dog)
   ```

### Step 6: Start the Development Servers

#### Method A: Run All Servers Separately (Recommended)

1. **Open 3 terminals in VS Code** (`Terminal > New Terminal`)

2. **Terminal 1 - API Backend:**
   ```bash
   npm run dev
   # or
   node server.js
   ```
   Should show: `🐾 Pet Care & Support API Server Started! 🌐 Server: http://localhost:3000`

3. **Terminal 2 - PWA Frontend:**
   ```bash
   cd pwa
   npm run dev
   ```
   Should show: `▲ Next.js ready on http://localhost:3002`

4. **Terminal 3 - Admin Dashboard:**
   ```bash
   cd admin
   npm run dev
   ```
   Should show: `▲ Next.js ready on http://localhost:3001`

#### Method B: Using Process Manager (Optional)
```bash
# Install PM2 globally
npm install -g pm2

# Start all services
npm run start:all
```

### Step 7: Verify Everything is Working

1. **API Health Check:**
   - Open: http://localhost:3000
   - You should see the Pet Care API welcome page

2. **Test API endpoint:**
   - Open VS Code Thunder Client extension
   - GET request to: http://localhost:3000/api/health
   - Should return: `{"status":"success","message":"Pet Care API is running!"...}`

3. **PWA Application:**
   - Open: http://localhost:3002
   - You should see the Pet Care Platform homepage

4. **Admin Dashboard:**
   - Open: http://localhost:3001
   - You should see the admin interface

### Step 8: Test with Demo Accounts

Try logging in with these demo accounts:

#### **Super Admin Account**
- **Email**: `admin@petcare.uk`
- **Password**: `admin123`
- **Access**: Full platform administration

#### **Pet Owner Account**
- **Email**: `sarah@example.com`
- **Password**: `user123`
- **Features**: Has 2 demo pets (Bella & Whiskers)

#### **Veterinarian Account**
- **Email**: `james.wilson@vetcare.uk`
- **Password**: `vet123`
- **Features**: Veterinary services and pet health management

#### **Service Provider Account**
- **Email**: `emma@pawsitters.uk`
- **Password**: `provider123`
- **Features**: Pet sitting services

---

## 🛠️ Development Workflow

### VS Code Setup for Development

1. **Install recommended extensions** (VS Code will prompt you)

2. **Configure VS Code settings** (`.vscode/settings.json`):
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "emmet.includeLanguages": {
       "javascript": "javascriptreact"
     }
   }
   ```

3. **Use integrated terminal** for all commands

4. **File structure in VS Code Explorer:**
   ```
   pet_app1/
   ├── 📁 admin/           # Admin dashboard (Next.js)
   ├── 📁 models/          # MongoDB schemas
   ├── 📁 routes/          # API endpoints
   ├── 📁 pwa/            # PWA frontend (Next.js)
   ├── 📁 middleware/      # Express middleware
   ├── 📁 seeders/         # Demo data
   ├── 📁 scripts/         # Utility scripts
   ├── 📄 server.js        # Main API server
   ├── 📄 .env            # Environment variables
   └── 📄 package.json     # Dependencies
   ```

### Useful VS Code Shortcuts

- **`Ctrl+` `**: Open/close terminal
- **`Ctrl+Shift+` `**: New terminal
- **`Ctrl+P`**: Quick file search
- **`Ctrl+Shift+P`**: Command palette
- **`F5`**: Start debugging
- **`Ctrl+Shift+F`**: Search in all files

---

## 🚨 Troubleshooting

### Common Issues and Solutions:

#### **MongoDB Connection Issues**
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"

# Start MongoDB (if local installation)
# Windows: Start MongoDB service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### **Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or change port in .env file
PORT=3005
```

#### **Module Not Found Errors**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **PWA Not Loading**
```bash
# Check if API is running on port 3000
curl http://localhost:3000/api/health

# Clear Next.js cache
cd pwa
rm -rf .next
npm run dev
```

#### **Demo Data Issues**
```bash
# Re-seed demo data
node scripts/seed-demo-data.js

# Or clear database and re-seed
mongo petcare --eval "db.dropDatabase()"
node scripts/seed-demo-data.js
```

---

## 🔧 Additional Configuration

### API Testing in VS Code

1. **Install Thunder Client extension**
2. **Create API collection:**
   - New Request → GET → `http://localhost:3000/api/health`
   - New Request → POST → `http://localhost:3000/api/auth/login`
     ```json
     {
       "email": "admin@petcare.uk",
       "password": "admin123"
     }
     ```

### Database Management

1. **Install MongoDB for VS Code extension**
2. **Connect to database:**
   - Command Palette → "MongoDB: Connect"
   - Connection string: `mongodb://localhost:27017`
3. **Browse collections**: Users, Pets, etc.

### Debugging Setup

1. **Create `.vscode/launch.json`:**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Launch API Server",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/server.js",
         "env": {
           "NODE_ENV": "development"
         },
         "console": "integratedTerminal"
       }
     ]
   }
   ```

2. **Set breakpoints** and press `F5` to debug

---

## 📱 Mobile Testing

### Test PWA on Mobile Devices

1. **Find your computer's IP address:**
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```

2. **Update PWA environment:**
   ```env
   # In pwa/.env.local, replace localhost with your IP
   NEXT_PUBLIC_API_URL=http://192.168.1.100:3000/api
   ```

3. **Access on mobile:**
   - PWA: `http://192.168.1.100:3002`
   - Ensure both devices are on the same network

---

## 🎯 Success Indicators

You'll know everything is working when:

✅ **API Server**: Returns JSON response at http://localhost:3000/api/health  
✅ **PWA**: Loads homepage at http://localhost:3002  
✅ **Admin**: Loads dashboard at http://localhost:3001  
✅ **Authentication**: Can login with demo accounts  
✅ **Database**: Demo data visible (6 users, 3 pets)  
✅ **Features**: Can navigate through pet profiles, health records, services  

---

## 📞 Support

If you encounter issues:

1. **Check logs** in VS Code terminal for error messages
2. **Verify environment variables** in `.env` files
3. **Ensure all services** are running on correct ports
4. **Review troubleshooting section** above
5. **Check GitHub repository** for latest updates

---

## 🚀 Next Steps

Once everything is running:

1. **Explore Features**: Test all demo accounts and features
2. **Customize**: Modify colors, branding, add features
3. **Deploy**: Use DEPLOYMENT_CHECKLIST.md for production
4. **Contribute**: Follow CONTRIBUTING.md for development guidelines

**Happy coding! 🐾**