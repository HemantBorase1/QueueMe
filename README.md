# QueueMe - Barbershop Queue Management System

A complete full-stack barbershop queue management system built with Node.js, Express, MongoDB, Next.js, and Tailwind CSS.

## 🎯 Features

### Public Features
- **Queue Joining**: Customers can join the queue with name, phone, and service selection
- **Queue Status**: Real-time queue position and wait time checking
- **Service Catalog**: Browse available barbershop services with pricing
- **Trending Styles**: View trending haircut styles with images
- **SMS Notifications**: Automatic SMS updates for queue status

### Admin Features
- **Dashboard**: Real-time statistics and overview
- **Queue Management**: Live queue control with status updates
- **Records Management**: Historical data with filtering and bulk operations
- **Haircut Styles**: CRUD operations for trending styles
- **Settings**: Daily limit configuration and system settings
- **Authentication**: Secure admin login with JWT tokens

## 🏗️ Architecture

### Backend (Node.js/Express)
- **RESTful API** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for admin access
- **SMS Integration** with Twilio (mock mode for development)
- **CORS** enabled for frontend integration

### Frontend (Next.js/React)
- **Next.js 14** with App Router
- **Tailwind CSS** for responsive design
- **ShadCN UI** components for consistency
- **Client-side state management** with React hooks
- **API integration** with centralized client

## 📁 Project Structure

```
QueueMe/
├── backend/                 # Node.js API Server
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth & SMS middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── scripts/           # Database seeding scripts
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── env.example        # Environment template
├── frontend/              # Next.js React App
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities & API client
│   ├── package.json     # Frontend dependencies
│   └── env.example      # Environment template
├── SETUP_GUIDE.md       # Detailed setup instructions
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd QueueMe
```

### 2. Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run seed  # Populate initial data
npm run dev   # Start development server
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Edit .env.local with your configuration
npm run dev   # Start development server
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: admin / password123

## 🔧 Environment Configuration

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/queueMe

# JWT
JWT_SECRET=your-super-secret-jwt-key

# SMS
SMS_MODE=mock  # Use 'live' for production

# Server
PORT=5000
```

### Frontend (.env.local)
```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# App Info
NEXT_PUBLIC_APP_NAME=QueueMe
```

## 📊 Database Models

### User
- `name`: Customer name
- `mobile`: Phone number (unique)
- `createdAt`: Registration date

### Queue
- `user`: Reference to User
- `service`: Reference to Service
- `queueNumber`: Sequential number
- `status`: waiting|in-progress|completed|cancelled
- `estimatedWaitTime`: Wait time in minutes
- `checkInTime`: Queue entry time
- `startTime`: Service start time
- `endTime`: Service completion time

### Service
- `name`: Service name
- `description`: Service description
- `price`: Service price
- `duration`: Duration in minutes

### HaircutStyle
- `name`: Style name
- `description`: Style description
- `image`: Image URL
- `isTrending`: Trending status
- `createdAt`: Creation date

### DailyLimit
- `date`: Date
- `maxCustomers`: Maximum customers per day
- `currentCount`: Current customer count

## 🔌 API Endpoints

### Public Endpoints
- `POST /api/users/join-queue` - Join queue
- `GET /api/users/queue-status/:mobile` - Check queue status
- `PUT /api/users/cancel-queue/:mobile` - Cancel queue
- `GET /api/services` - Get services

### Admin Endpoints (Protected)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/queue` - Get queue list
- `PUT /api/admin/queue/:id/status` - Update queue status
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/records` - Get records
- `DELETE /api/admin/records` - Delete old records
- `GET /api/admin/haircut-styles` - Get haircut styles
- `POST /api/admin/haircut-styles` - Create haircut style
- `PUT /api/admin/haircut-styles/:id` - Update haircut style
- `PUT /api/admin/daily-limit` - Update daily limit

## 🎨 Frontend Pages

### Public Pages
- **Home** (`/`) - Queue joining form
- **Queue Status** (`/queue-status`) - Check position
- **Services** (`/services`) - Service catalog
- **Trending** (`/trending`) - Trending styles

### Admin Pages
- **Login** (`/admin/login`) - Admin authentication
- **Dashboard** (`/admin/dashboard`) - Statistics overview
- **Queue** (`/admin/queue`) - Queue management
- **Records** (`/admin/records`) - Historical data
- **Haircut Styles** (`/admin/haircut-styles`) - Style management
- **Settings** (`/admin/settings`) - System configuration

## 🛠️ Development

### Backend Commands
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm run seed     # Seed database
npm run seed:services  # Seed only services
npm run seed:styles    # Seed only styles
```

### Frontend Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use MongoDB Atlas
3. Configure Twilio for SMS
4. Use strong JWT secrets
5. Enable CORS for production domain

### Frontend Deployment
1. Build: `npm run build`
2. Set production environment variables
3. Deploy to Vercel/Netlify
4. Update API URL to production

## 🔒 Security Features

- **JWT Authentication** for admin access
- **Password Hashing** with bcrypt
- **CORS Protection** for API access
- **Input Validation** on all endpoints
- **Rate Limiting** (configurable)
- **Environment Variable** protection

## 📱 Mobile Responsive

- **Mobile-first design** with Tailwind CSS
- **Touch-friendly** interface
- **Responsive layouts** for all screen sizes
- **Progressive Web App** ready

## 🔄 Real-time Features

- **Queue Status Updates** via API polling
- **SMS Notifications** for queue changes
- **Live Statistics** on admin dashboard
- **Real-time Queue Management**

## 🧪 Testing

### Backend Testing
- Unit tests for models and utilities
- Integration tests for API endpoints
- Authentication and authorization tests

### Frontend Testing
- Component unit tests
- Integration tests for API calls
- End-to-end tests for user flows

## 📈 Performance

- **Database Indexing** for optimal queries
- **API Response Caching** (configurable)
- **Image Optimization** for haircut styles
- **Code Splitting** in frontend
- **Lazy Loading** for better performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the [Setup Guide](SETUP_GUIDE.md)
2. Review the console logs for errors
3. Verify environment variables
4. Ensure all dependencies are installed

## 🔮 Future Enhancements

- **Real-time WebSocket** connections
- **Advanced Analytics** and reporting
- **Multi-location** support
- **Customer Profiles** and history
- **Appointment Scheduling**
- **Payment Integration**
- **Multi-language** support
- **Advanced Notifications** (email, push)

---

**QueueMe** - Professional barbershop queue management made simple! 🎯✂️
