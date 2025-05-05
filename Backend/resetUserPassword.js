require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const resetUserPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-management');
    console.log('Connected to MongoDB');

    const email = 'user@example.com';
    const newPassword = 'password123';

    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found with email:', email);
      process.exit(1);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    console.log('Password reset successful for user:', email);
    console.log('New password:', newPassword);
    console.log('Hashed password:', hashedPassword);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetUserPassword(); 