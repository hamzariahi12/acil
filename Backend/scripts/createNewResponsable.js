const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createNewResponsable = async () => {
  try {
    // Create responsable user
    const hashedPassword = await bcrypt.hash('responsable123', 10);
    const responsable = new User({
      name: 'Restaurant Manager',
      email: 'restaurant.manager@luxdine.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'responsable'
    });

    await responsable.save();
    console.log('Responsable user created successfully');

    // Create restaurant for the responsable
    const restaurant = new Restaurant({
      name: 'LuxDine Restaurant',
      address: '123 Main Street',
      city: 'New York',
      phone: '1234567890',
      email: 'info@luxdine.com',
      description: 'A fine dining experience with exquisite cuisine',
      openingHours: 'Monday-Friday: 9:00-22:00, Saturday-Sunday: 10:00-23:00',
      owner: responsable._id,
      status: 'Open'
    });

    await restaurant.save();
    console.log('Restaurant created successfully');

    // Update responsable with restaurant reference
    responsable.restaurant = restaurant._id;
    await responsable.save();
    console.log('Responsable updated with restaurant reference');

    console.log('Setup completed successfully!');
    console.log('New Responsable credentials:');
    console.log('Email: restaurant.manager@luxdine.com');
    console.log('Password: responsable123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

createNewResponsable(); 