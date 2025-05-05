const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const checkUsers = async () => {
  try {
    const users = await User.find({});
    console.log('All users in database:');
    users.forEach(user => {
      console.log('-------------------');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Restaurant:', user.restaurant);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

checkUsers(); 