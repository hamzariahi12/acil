require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const checkUserLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-management');
    console.log('Connected to MongoDB');

    const email = 'test@example.com';
    const password = 'password123';

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
      process.exit(1);
    }

    console.log('User found:', {
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      hashedPassword: user.password
    });

    // Try to hash the password again to compare
    const hashedTestPassword = await bcrypt.hash(password, 10);
    console.log('New hashed password:', hashedTestPassword);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    // Try the model's comparePassword method
    const modelMatch = await user.comparePassword(password);
    console.log('Model comparePassword match:', modelMatch);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUserLogin(); 