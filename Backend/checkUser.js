require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-management');
    console.log('Connected to MongoDB');

    // Replace with the email you're trying to use
    const email = 'owner@example.com';
    const user = await User.findOne({ email });
    
    if (user) {
      console.log('User found:', {
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      });
    } else {
      console.log('No user found with email:', email);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser(); 