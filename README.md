# 🐾 Pet Care & Support Platform

A comprehensive Progressive Web App (PWA) ecosystem designed for the UK pet market, providing pet owners with everything they need to care for their beloved companions.

![Pet Care Platform](https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=400&fit=crop)

## 🌟 Features

### 🔐 **User Authentication & Management**
- Secure JWT-based authentication
- UK-specific phone number and postcode validation
- User profiles with avatar management
- Role-based access control

### 🐕 **Pet Management System**
- Complete pet profile creation and management
- Photo galleries and pet documentation
- Medical history and health records
- Microchip and identification tracking
- Emergency contact management

### 🏪 **Services Marketplace**
- Professional service provider listings
- Booking and scheduling system
- Location-based service discovery
- Provider ratings and reviews
- Multiple service categories:
  - Dog Walking
  - Pet Sitting
  - Grooming
  - Training
  - Veterinary Care

### 🏥 **Health Tracking & Veterinary Care**
- Comprehensive health record management
- Vaccination schedule tracking
- Veterinarian appointment booking
- Health reminders and alerts
- Medical document storage
- Weight tracking and health insights

### 🛍️ **E-commerce Shop**
- Pet product catalog
- Shopping cart functionality
- Order management system
- Product reviews and ratings
- UK pricing in GBP
- Secure payment processing

### 🐾 **Pet Adoption System**
- Browse adoptable pets from rescue centers
- Advanced filtering and search
- Adoption application system
- Rescue center integration
- Featured and urgent adoption listings

### 🚨 **Emergency Services**
- 24/7 emergency veterinary finder
- Geolocation-based service discovery
- Emergency contact management
- First aid guides and resources
- Real-time service availability

### 👥 **Social Community**
- Community posts and discussions
- Pet playdate organization
- Social feed with photos and stories
- User connections and networking
- Comment and interaction system

### 📱 **Progressive Web App**
- Mobile-first responsive design
- Offline functionality
- Push notifications
- App-like experience
- Cross-platform compatibility

## 🛠 Technical Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB 6.x
- **Authentication**: JWT with bcryptjs
- **Validation**: express-validator
- **File Uploads**: multer
- **Real-time**: Socket.io
- **Security**: CORS, helmet, rate limiting

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x
- **Icons**: Heroicons 2.x
- **PWA**: next-pwa plugin
- **State Management**: React Context API

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB 6.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pet-care-platform.git
   cd pet-care-platform
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install PWA dependencies**
   ```bash
   cd pwa
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start MongoDB**
   ```bash
   # Using MongoDB service
   sudo systemctl start mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:6
   ```

6. **Start the backend server**
   ```bash
   npm start
   ```

7. **Start the PWA development server**
   ```bash
   cd pwa
   npm run dev
   ```

8. **Access the application**
   - Backend API: http://localhost:3000
   - PWA Application: http://localhost:3001
   - API Documentation: http://localhost:3000/api

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# Database
MONGODB_URI=mongodb://localhost:27017/petcare

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=1000000

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# External APIs (optional)
GOOGLE_MAPS_API_KEY=your-google-maps-key
STRIPE_SECRET_KEY=your-stripe-key
```

## 🏗 Project Structure

```
pet-care-platform/
├── 📁 models/                 # Database models
│   ├── User.js
│   └── Pet.js
├── 📁 routes/                 # API routes
│   ├── auth.js
│   ├── pets.js
│   ├── services.js
│   ├── health.js
│   ├── social.js
│   ├── ecommerce.js
│   ├── adoption.js
│   └── emergency.js
├── 📁 middleware/             # Custom middleware
│   ├── auth.js
│   ├── error.js
│   └── upload.js
├── 📁 pwa/                    # Next.js PWA
│   ├── 📁 app/               # App Router pages
│   ├── 📁 components/        # React components
│   ├── 📁 contexts/          # React contexts
│   ├── 📁 lib/              # Utilities and API
│   └── 📁 public/           # Static assets
├── 📁 uploads/               # File uploads
├── server.js                 # Main server file
├── package.json
└── README.md
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Pet Management
- `GET /api/pets` - Get user pets
- `POST /api/pets` - Create new pet
- `GET /api/pets/:id` - Get pet details
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Services
- `GET /api/services` - Browse services
- `GET /api/services/:id` - Get service details
- `POST /api/services/book` - Book a service

### Health Records
- `GET /api/health-records/records` - Get health records
- `POST /api/health-records/records` - Add health record
- `GET /api/health-records/vaccinations` - Get vaccinations

### E-commerce
- `GET /api/shop/products` - Browse products
- `POST /api/shop/cart` - Add to cart
- `GET /api/shop/orders` - Get orders

### Emergency Services
- `GET /api/emergency/services` - Find emergency services
- `POST /api/emergency/request` - Create emergency request

[View complete API documentation](http://localhost:3000/api)

## 🧪 Testing

### Run Backend Tests
```bash
npm test
```

### Run PWA Tests
```bash
cd pwa
npm test
```

### API Testing with curl
```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","firstName":"Test","lastName":"User","phone":"07123456789"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🚀 Deployment

### Production Build

1. **Build the PWA**
   ```bash
   cd pwa
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI=your-production-mongodb-uri
   export JWT_SECRET=your-production-jwt-secret
   ```

3. **Start production server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t pet-care-platform .
   ```

2. **Run container**
   ```bash
   docker run -d -p 3000:3000 \
     -e MONGODB_URI=your-mongodb-uri \
     -e JWT_SECRET=your-jwt-secret \
     pet-care-platform
   ```

### Cloud Deployment Options

- **Vercel** (PWA) + **Railway** (Backend)
- **AWS** (EC2, RDS, S3)
- **Google Cloud Platform**
- **Microsoft Azure**
- **DigitalOcean**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Secure headers with helmet
- File upload restrictions

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered pet health insights
- [ ] Integration with veterinary clinics
- [ ] Multi-language support
- [ ] Premium subscription features

## 📞 Support

- **Documentation**: [docs.petcare.uk](https://docs.petcare.uk)
- **Email**: support@petcare.uk
- **Issues**: [GitHub Issues](https://github.com/your-username/pet-care-platform/issues)

## 👏 Acknowledgments

- Icons by [Heroicons](https://heroicons.com/)
- Images from [Unsplash](https://unsplash.com/)
- Built with [Next.js](https://nextjs.org/) and [Express.js](https://expressjs.com/)

---

**Made with ❤️ for pet lovers across the UK** 🇬🇧

*Last updated: September 13, 2025*