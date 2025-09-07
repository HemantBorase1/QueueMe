# QueueMe - Complete Setup Guide

This guide will help you set up both the backend and frontend for the QueueMe barbershop queue management system.

## 📁 Project Structure

```
QueueMe/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Database configuration
│   ├── middleware/         # Authentication & SMS middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── env.example        # Backend environment template
├── frontend/              # Next.js React application
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   ├── package.json     # Frontend dependencies
│   └── env.example      # Frontend environment template
└── SETUP_GUIDE.md       # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (for version control)

### 1. Backend Setup

#### Navigate to backend directory:
```bash
cd backend
```

#### Install dependencies:
```bash
npm install
```

#### Create environment file:
```bash
# Copy the example file
cp env.example .env

# Edit the .env file with your configuration
```

#### Key Backend Environment Variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/queueMe

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# SMS Configuration
SMS_MODE=mock  # Use 'live' for production with Twilio

# Server
PORT=5000
```

#### Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will be available at: `http://localhost:5000`

### 2. Frontend Setup

#### Navigate to frontend directory:
```bash
cd frontend
```

#### Install dependencies:
```bash
npm install
```

#### Create environment file:
```bash
# Copy the example file
cp env.example .env.local

# Edit the .env.local file with your configuration
```

#### Key Frontend Environment Variables:
```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Application Info
NEXT_PUBLIC_APP_NAME=QueueMe
```

#### Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 🔧 Backend Dependencies Analysis

### Core Dependencies:
- **express** (^5.1.0) - Web framework
- **mongoose** (^8.18.0) - MongoDB ODM
- **cors** (^2.8.5) - Cross-origin resource sharing
- **dotenv** (^17.2.2) - Environment variable loader

### Authentication & Security:
- **jsonwebtoken** (^9.0.2) - JWT token handling
- **bcryptjs** (^3.0.2) - Password hashing

### Communication:
- **twilio** (^5.9.0) - SMS notifications
- **moment** (^2.30.1) - Date/time manipulation

### API Endpoints:
- `GET /` - Health check
- `POST /api/users/join-queue` - Join queue
- `GET /api/users/queue-status/:mobile` - Check queue status
- `PUT /api/users/cancel-queue/:mobile` - Cancel queue
- `GET /api/services` - Get services
- `POST /api/auth/login` - Admin login
- `GET /api/admin/queue` - Get queue (admin)
- `PUT /api/admin/queue/:id/status` - Update queue status
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/records` - Get records
- `DELETE /api/admin/records` - Delete old records
- `GET /api/admin/haircut-styles` - Get haircut styles
- `POST /api/admin/haircut-styles` - Create haircut style
- `PUT /api/admin/haircut-styles/:id` - Update haircut style
- `PUT /api/admin/daily-limit` - Update daily limit

## 🎨 Frontend Dependencies Analysis

### Core Dependencies:
- **next** (^14.2.5) - React framework
- **react** (^18.3.1) - UI library
- **react-dom** (^18.3.1) - React DOM rendering

### Styling & UI:
- **tailwindcss** (^3.4.10) - CSS framework
- **classnames** (^2.5.1) - CSS class utility
- **lucide-react** (^0.263.1) - Icon library

### Development Dependencies:
- **autoprefixer** (^10.4.20) - CSS autoprefixer
- **postcss** (^8.4.41) - CSS processor
- **eslint** (^8.57.0) - Code linting
- **eslint-config-next** (^14.2.5) - Next.js ESLint config

## 🔗 Backend-Frontend Integration

### API Client Configuration:
The frontend uses a centralized API client (`lib/api.js`) that:
- Handles all HTTP requests to the backend
- Manages JWT authentication tokens
- Provides error handling and response parsing
- Supports all backend endpoints

### Authentication Flow:
1. Admin logs in via `/admin/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. All subsequent requests include the token
5. Backend validates token on protected routes

### Data Flow:
1. **Public Pages**: Direct API calls for services, queue status
2. **Admin Pages**: Authenticated API calls with JWT tokens
3. **Real-time Updates**: Polling mechanism for queue status
4. **Form Submissions**: Direct API integration with validation

## 🗄️ Database Models

### User Model:
```javascript
{
  name: String,
  mobile: String (unique),
  createdAt: Date
}
```

### Queue Model:
```javascript
{
  user: ObjectId (ref: User),
  service: ObjectId (ref: Service),
  queueNumber: Number,
  status: String (waiting|in-progress|completed|cancelled),
  estimatedWaitTime: Number,
  checkInTime: Date,
  startTime: Date,
  endTime: Date
}
```

### Service Model:
```javascript
{
  name: String,
  description: String,
  price: Number,
  duration: Number (minutes)
}
```

### HaircutStyle Model:
```javascript
{
  name: String,
  description: String,
  image: String (URL),
  isTrending: Boolean,
  createdAt: Date
}
```

### DailyLimit Model:
```javascript
{
  date: Date,
  maxCustomers: Number,
  currentCount: Number
}
```

## 🚀 Production Deployment

### Backend Deployment:
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or production MongoDB
3. Configure Twilio for SMS (set `SMS_MODE=live`)
4. Use strong JWT secrets
5. Enable CORS for production domain
6. Set up proper logging and monitoring

### Frontend Deployment:
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to Vercel, Netlify, or your preferred platform
4. Update `NEXT_PUBLIC_BACKEND_URL` to production API URL

## 🔧 Development Commands

### Backend:
```bash
npm run dev    # Start with nodemon
npm start      # Start production server
npm test       # Run tests (when implemented)
```

### Frontend:
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify database permissions

2. **CORS Errors**:
   - Check CORS_ORIGIN in backend .env
   - Ensure frontend URL matches CORS settings

3. **JWT Token Errors**:
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure proper token format

4. **API Connection Issues**:
   - Verify backend is running on correct port
   - Check NEXT_PUBLIC_BACKEND_URL in frontend .env
   - Ensure no firewall blocking

## 📞 Support

For issues or questions:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that both backend and frontend are running

## 🔄 Next Steps

1. **Seed Data**: Create initial services and admin user
2. **Testing**: Add unit and integration tests
3. **Monitoring**: Set up logging and error tracking
4. **Security**: Implement rate limiting and input validation
5. **Performance**: Add caching and optimization
6. **Features**: Add more advanced queue management features
