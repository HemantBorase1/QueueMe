const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import AdminUser model
const AdminUser = require('../models/AdminUser');

const createAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB with timeout settings
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/queueMe', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    });
    
    console.log('✅ MongoDB Connected!');
    
    // Check if admin user already exists
    const existingAdmin = await AdminUser.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`   Username: ${existingAdmin.username}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Active: ${existingAdmin.isActive}`);
      return existingAdmin;
    }
    
    // Create new admin user
    console.log('👤 Creating admin user...');
    
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password123', 10);
    
    const adminUser = new AdminUser({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@queueme.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    });
    
    await adminUser.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log(`   Username: ${adminUser.username}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Active: ${adminUser.isActive}`);
    
    return adminUser;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.log('ℹ️  Admin user already exists with this username/email');
    }
    
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

// Run if this file is executed directly
if (require.main === module) {
  createAdmin()
    .then(() => {
      console.log('\n🚀 You can now login with:');
      console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'password123'}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Failed to create admin user:', error.message);
      process.exit(1);
    });
}

module.exports = createAdmin;
