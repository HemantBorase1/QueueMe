# QueueMe Backend - Barbershop Queue Management System

## 🏗️ Architecture Overview

The QueueMe backend is a Node.js/Express REST API that manages a barbershop queue system with MongoDB as the database. It provides both public endpoints for customers and protected admin endpoints for barbershop management.

## 📊 Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   MongoDB       │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Twilio SMS    │
                       │   (Optional)    │
                       └─────────────────┘
```

## 🔐 Authentication System

### User Types
1. **Public Users** - No authentication required
2. **Admin Users** - JWT token authentication required

### Authentication Flow

```
┌─────────────────┐
│   Admin Login   │
└─────────┬───────┘
          │ POST /api/auth/login
          ▼
┌─────────────────┐
│   Verify Creds  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   Generate JWT  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   Return Token  │
└─────────────────┘
```

### JWT Token Structure
```javascript
{
  user: {
    id: 'admin',
    role: 'admin'
  },
  iat: 1234567890,
  exp: 1234654290
}
```

## 🗄️ Database Models

### 1. User Model
```javascript
{
  name: String,        // Customer name
  mobile: String,      // Phone number (unique)
  createdAt: Date      // Registration timestamp
}
```

### 2. Queue Model
```javascript
{
  user: ObjectId,           // Reference to User
  service: ObjectId,        // Reference to Service
  queueNumber: Number,      // Sequential queue number
  status: String,           // waiting|in-progress|completed|cancelled
  estimatedWaitTime: Number, // Wait time in minutes
  checkInTime: Date,        // Queue entry time
  startTime: Date,          // Service start time
  endTime: Date             // Service completion time
}
```

### 3. Service Model
```javascript
{
  name: String,        // Service name
  description: String, // Service description
  price: Number,       // Service price
  duration: Number     // Duration in minutes
}
```

### 4. HaircutStyle Model
```javascript
{
  name: String,        // Style name
  description: String, // Style description
  image: String,       // Image URL
  isTrending: Boolean, // Trending status
  createdAt: Date      // Creation timestamp
}
```

### 5. DailyLimit Model
```javascript
{
  date: Date,          // Date (unique)
  maxCustomers: Number, // Maximum customers per day
  currentCount: Number  // Current customer count
}
```

## 🛣️ API Routes & Data Flow

### Public Routes (No Authentication)

#### 1. Services
```
GET /api/services
```
**Flow:**
1. Frontend requests services
2. Backend queries Service collection
3. Returns all available services

#### 2. Join Queue
```
POST /api/users/join-queue
Body: { name, mobile, serviceId }
```
**Flow:**
1. Validate input data
2. Check if user already in queue
3. Check daily limit
4. Create/find user
5. Get service details
6. Generate queue number
7. Calculate estimated wait time
8. Create queue entry
9. Update daily count
10. Send SMS notification
11. Return success response

#### 3. Check Queue Status
```
GET /api/users/queue-status/:mobile
```
**Flow:**
1. Find user by mobile
2. Find active queue entry
3. Calculate position in queue
4. Calculate estimated wait time
5. Return queue status

#### 4. Cancel Queue
```
PUT /api/users/cancel-queue/:mobile
```
**Flow:**
1. Find user by mobile
2. Find waiting queue entry
3. Update status to 'cancelled'
4. Set end time
5. Send cancellation SMS
6. Return success response

### Admin Routes (JWT Authentication Required)

#### 1. Authentication
```
POST /api/auth/login
Body: { username, password }
```
**Flow:**
1. Validate credentials
2. Compare password with bcrypt
3. Generate JWT token
4. Return token

#### 2. Queue Management
```
GET /api/admin/queue?status=waiting
PUT /api/admin/queue/:id/status
Body: { status }
```
**Flow:**
1. Verify JWT token
2. Check admin role
3. Query/update queue entries
4. Send SMS notifications for status changes
5. Return updated data

#### 3. Statistics
```
GET /api/admin/stats
```
**Flow:**
1. Verify JWT token
2. Check admin role
3. Count queue entries by status for today
4. Return statistics

#### 4. Records Management
```
GET /api/admin/records?period=today&status=completed&page=1&limit=10
DELETE /api/admin/records
Body: { days: 30 }
```
**Flow:**
1. Verify JWT token
2. Check admin role
3. Apply date and status filters
4. Return paginated results or delete old records

#### 5. Haircut Styles Management
```
GET /api/admin/haircut-styles?trending=true
POST /api/admin/haircut-styles
PUT /api/admin/haircut-styles/:id
```
**Flow:**
1. Verify JWT token
2. Check admin role
3. CRUD operations on HaircutStyle collection
4. Return updated data

#### 6. Daily Limit Management
```
PUT /api/admin/daily-limit
Body: { maxCustomers }
```
**Flow:**
1. Verify JWT token
2. Check admin role
3. Update/create daily limit for today
4. Return updated limit

## 🔄 Complete Data Flow Examples

### Customer Joins Queue
```
1. Customer fills form on frontend
2. Frontend sends POST /api/users/join-queue
3. Backend validates data
4. Backend checks daily limit
5. Backend creates user (if new)
6. Backend creates queue entry
7. Backend updates daily count
8. Backend sends SMS notification
9. Backend returns queue number and wait time
10. Frontend displays success message
```

### Admin Updates Queue Status
```
1. Admin clicks "Start Service" button
2. Frontend sends PUT /api/admin/queue/:id/status
3. Backend verifies JWT token
4. Backend checks admin role
5. Backend updates queue status
6. Backend sets start time
7. Backend sends SMS to customer
8. Backend returns updated queue data
9. Frontend refreshes queue display
```

### Customer Checks Queue Status
```
1. Customer enters phone number
2. Frontend sends GET /api/users/queue-status/:mobile
3. Backend finds user by mobile
4. Backend finds active queue entry
5. Backend calculates position and wait time
6. Backend returns queue status
7. Frontend displays position and wait time
```

## 🛡️ Security Features

### Authentication Middleware
```javascript
// JWT Token Verification
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

// Admin Role Check
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};
```

### Password Security
- Passwords hashed with bcryptjs
- Salt rounds: 10
- JWT tokens expire in 24 hours

## 📱 SMS Integration

### Twilio Integration
```javascript
const sendSMS = async (to, message) => {
  // Mock mode for development
  if (process.env.SMS_MODE === 'mock') {
    console.log(`SMS to ${to}: ${message}`);
    return true;
  }
  
  // Production Twilio integration
  const client = require('twilio')(accountSid, authToken);
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to
  });
};
```

### SMS Triggers
1. **Queue Join Confirmation** - When customer joins queue
2. **Service Start Notification** - When barber starts service
3. **Queue Cancellation** - When customer cancels queue

## 🚀 Environment Configuration

### Required Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/queueMe

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=24h

# SMS
SMS_MODE=mock  # or 'live' for production
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Server
PORT=5000
NODE_ENV=development

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123

# Business Settings
DEFAULT_DAILY_LIMIT=50
```

## 📊 Business Logic

### Queue Number Generation
- Resets daily at midnight
- Sequential numbering (1, 2, 3, ...)
- Based on check-in time for the day

### Wait Time Calculation
- Assumes 15 minutes per customer
- Calculated as: `waitingCustomers * 15`
- Updated in real-time

### Daily Limit Management
- Configurable per day
- Prevents overbooking
- Tracks current customer count
- Resets daily at midnight

### Queue Status Lifecycle
```
waiting → in-progress → completed
   ↓
cancelled
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Seed database
npm run seed

# Seed specific data
npm run seed:services
npm run seed:styles
```

## 🧪 Testing the API

### Using cURL

#### Join Queue
```bash
curl -X POST http://localhost:5000/api/users/join-queue \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","mobile":"1234567890","serviceId":"service_id_here"}'
```

#### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

#### Get Queue (Admin)
```bash
curl -X GET http://localhost:5000/api/admin/queue \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📈 Performance Considerations

### Database Indexing
- `User.mobile` - Unique index for fast lookups
- `Queue.user` - Index for user queue queries
- `Queue.status` - Index for status filtering
- `Queue.checkInTime` - Index for date range queries

### Caching Strategy
- Service data can be cached (rarely changes)
- Queue statistics can be cached with TTL
- Daily limits can be cached until reset

### Rate Limiting
- Configurable rate limiting per IP
- Prevents abuse of public endpoints
- Separate limits for admin endpoints

## 🚨 Error Handling

### Standard Error Responses
```javascript
// 400 Bad Request
{ "message": "Invalid credentials" }

// 401 Unauthorized
{ "message": "No token, authorization denied" }

// 403 Forbidden
{ "message": "Access denied. Admin role required." }

// 404 Not Found
{ "message": "User not found" }

// 500 Server Error
{ "message": "Server error" }
```

### Validation Errors
- Input validation on all endpoints
- Mongoose schema validation
- Custom business logic validation

## 🔮 Future Enhancements

### Planned Features
- Real-time WebSocket connections
- Advanced analytics and reporting
- Multi-location support
- Customer profiles and history
- Appointment scheduling
- Payment integration
- Email notifications
- Push notifications

### Technical Improvements
- Redis caching layer
- Database connection pooling
- API rate limiting
- Request logging
- Health check endpoints
- API documentation (Swagger)

---

**QueueMe Backend** - Professional barbershop queue management API! 🎯✂️
