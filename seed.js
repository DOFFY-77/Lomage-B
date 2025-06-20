require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lomageb');
    console.log('📡 Connected to MongoDB');

    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing users and products');

    // Create users first
    const users = [
      {
        phone: '+212612345678',
        username: 'amrani',
        name: 'عمـر العـمراني',
        image: '',
        purchasesIds: [],
        forSaleIds: [],
        password: await bcrypt.hash('mypassword123', 10),
        isPhoneVerified: true
      },
      {
        phone: '+1234567890',
        username: 'testuser',
        name: 'Test User',
        image: '',
        purchasesIds: [],
        forSaleIds: [],
        password: await bcrypt.hash('password123', 10),
        isPhoneVerified: true
      }
    ];
    const createdUsers = await User.insertMany(users);

    // Create products with correct sellerId and buyerId
    const products = await Product.insertMany([
      {
        title: 'كرسي مكتب مريح',
        description: 'كرسي عالي الجودة، استخدام خفيف، لون أسود.',
        price: 280,
        currency: 'RS',
        category: 'أثاث مكتبي',
        images: [],
        isSold: false,
        isReceived: false,
        sellerId: createdUsers[0]._id,
        buyerId: createdUsers[1]._id
      },
      {
        title: 'طاولة كمبيوتر',
        description: 'طاولة متينة مع مساحة تخزين.',
        price: 400,
        currency: 'RS',
        category: 'أثاث مكتبي',
        images: [],
        isSold: false,
        isReceived: false,
        sellerId: createdUsers[1]._id,
        buyerId: createdUsers[0]._id
      }
    ]);

    // Update users with purchasesIds and forSaleIds
    createdUsers[0].purchasesIds = [products[1]._id];
    createdUsers[0].forSaleIds = [products[0]._id];
    createdUsers[1].purchasesIds = [products[0]._id];
    createdUsers[1].forSaleIds = [products[1]._id];
    await createdUsers[0].save();
    await createdUsers[1].save();

    console.log('✅ Created test users and products.');
    console.log('   📱 +212612345678 / amrani / mypassword123');
    console.log('   📱 +1234567890 / testuser / password123');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
  }
}

seed();