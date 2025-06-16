require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lomageb');
    console.log('📡 Connected to MongoDB');

    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    const users = [
      {
        phone: '+212671765841',
        username: 'amrani',
        password: await bcrypt.hash('mypassword123', 10),
        isPhoneVerified: true
      },
      {
        phone: '+1234567890',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
        isPhoneVerified: true
      }
    ];

    await User.insertMany(users);
    console.log('✅ Created test users:');
    console.log('   📱 +212671765841 / amrani / mypassword123 (YOUR NUMBER)');
    console.log('   📱 +1234567890 / testuser / password123');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
}

seed();