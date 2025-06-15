require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lomageb';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    console.log('Connecting to MongoDB:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create fake users
    const fakeUsers = [
      {
        phone: '+1234567890',
        username: 'testuser1',
        password: await bcrypt.hash('password123', 10),
        isPhoneVerified: true
      },
      {
        phone: '+0987654321',
        username: 'testuser2', 
        password: await bcrypt.hash('mypassword', 10),
        isPhoneVerified: true
      },
      {
        phone: '+1122334455',
        username: 'johnsmith',
        password: await bcrypt.hash('john123', 10),
        isPhoneVerified: true
      },
      {
        phone: '+5566778899',
        username: 'alice',
        password: await bcrypt.hash('alice456', 10),
        isPhoneVerified: true
      },
      {
        phone: '+9988776655',
        username: 'bob',
        password: await bcrypt.hash('bob789', 10),
        isPhoneVerified: true
      },
      // User with phone verified but no password (incomplete registration)
      {
        phone: '+1111222233',
        isPhoneVerified: true
        // No username or password - incomplete signup
      },
      // User with OTP pending (for testing OTP flow)
      {
        phone: '+3333444455',
        username: 'pending_user',
        otp: '123456',
        otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes from now
        isPhoneVerified: false
      }
    ];

    // Insert fake users
    const insertedUsers = await User.insertMany(fakeUsers);
    console.log(`Created ${insertedUsers.length} fake users:`);
    
    insertedUsers.forEach(user => {
      console.log(`  ${user.phone} - ${user.username || 'No username'} - Verified: ${user.isPhoneVerified}`);
    });

    console.log('\nTEST DATA SUMMARY:');
    console.log('===================');
    console.log('Complete Users (can login):');

    console.log('\nDatabase seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding
seedDatabase();