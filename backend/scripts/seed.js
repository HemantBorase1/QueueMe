const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Service = require('../models/Service');
const HaircutStyle = require('../models/HaircutStyle');
const DailyLimit = require('../models/DailyLimit');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/queueMe');
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedServices = async () => {
  try {
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Create default services
    const services = [
      {
        name: 'Haircut',
        description: 'Professional haircut with styling',
        price: 25.00,
        duration: 30
      },
      {
        name: 'Beard Trim',
        description: 'Beard trimming and shaping',
        price: 15.00,
        duration: 20
      },
      {
        name: 'Haircut + Beard',
        description: 'Complete grooming package',
        price: 35.00,
        duration: 45
      },
      {
        name: 'Hair Wash & Style',
        description: 'Hair washing with professional styling',
        price: 20.00,
        duration: 25
      },
      {
        name: 'Mustache Trim',
        description: 'Mustache trimming and styling',
        price: 12.00,
        duration: 15
      }
    ];

    const createdServices = await Service.insertMany(services);
    console.log(`✅ Created ${createdServices.length} services`);
    return createdServices;
  } catch (error) {
    console.error('Error seeding services:', error);
  }
};

const seedHaircutStyles = async () => {
  try {
    // Clear existing styles
    await HaircutStyle.deleteMany({});
    console.log('Cleared existing haircut styles');

    // Create default trending styles
    const styles = [
      {
        name: 'Classic Fade',
        description: 'A timeless fade cut that never goes out of style',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3d1?w=400',
        isTrending: true
      },
      {
        name: 'Buzz Cut',
        description: 'Short, even-length cut for a clean look',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
        isTrending: true
      },
      {
        name: 'Pompadour',
        description: 'Classic pompadour with volume and style',
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400',
        isTrending: true
      },
      {
        name: 'Undercut',
        description: 'Modern undercut with longer top',
        image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
        isTrending: true
      },
      {
        name: 'Side Part',
        description: 'Professional side part for business look',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        isTrending: false
      },
      {
        name: 'Textured Crop',
        description: 'Modern textured crop with movement',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        isTrending: true
      }
    ];

    const createdStyles = await HaircutStyle.insertMany(styles);
    console.log(`✅ Created ${createdStyles.length} haircut styles`);
    return createdStyles;
  } catch (error) {
    console.error('Error seeding haircut styles:', error);
  }
};

const seedDailyLimit = async () => {
  try {
    // Clear existing daily limits
    await DailyLimit.deleteMany({});
    console.log('Cleared existing daily limits');

    // Create today's daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyLimit = new DailyLimit({
      date: today,
      maxCustomers: parseInt(process.env.DEFAULT_DAILY_LIMIT) || 50,
      currentCount: 0
    });

    await dailyLimit.save();
    console.log('✅ Created daily limit for today');
    return dailyLimit;
  } catch (error) {
    console.error('Error seeding daily limit:', error);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...\n');
    
    // Seed services
    await seedServices();
    console.log('');
    
    // Seed haircut styles
    await seedHaircutStyles();
    console.log('');
    
    // Seed daily limit
    await seedDailyLimit();
    console.log('');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Services: Created default barbershop services');
    console.log('- Haircut Styles: Created trending styles with images');
    console.log('- Daily Limit: Set up today\'s customer limit');
    console.log('\n🚀 You can now start the application!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from database');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData, seedServices, seedHaircutStyles, seedDailyLimit };
