require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-management');
    console.log('Connected to MongoDB');

    // Delete existing user if exists
    await User.deleteMany({ email: 'test@example.com' });

    // Create new user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      role: 'owner',
      isActive: true
    });

    await user.save();
    console.log('Test user created successfully:', {
      email: user.email,
      password: 'password123'
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestUser(); 