const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const createResponsable = async () => {
  try {
    // Create responsable user
    const hashedPassword = await bcrypt.hash('responsable123', 10);
    const responsable = new User({
      name: 'Restaurant Manager',
      email: 'responsable@example.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'responsable'
    });

    await responsable.save();
    console.log('Responsable user created successfully');

    // Create restaurant for the responsable
    const restaurant = new Restaurant({
      name: 'LuxDine Restaurant',
      address: '123 Main Street, City',
      phone: '1234567890',
      email: 'info@luxdine.com',
      description: 'A fine dining experience with exquisite cuisine',
      openingHours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '10:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' }
      },
      responsable: responsable._id,
      tables: [
        { number: 1, capacity: 2, status: 'available' },
        { number: 2, capacity: 4, status: 'available' },
        { number: 3, capacity: 6, status: 'available' },
        { number: 4, capacity: 2, status: 'available' },
        { number: 5, capacity: 4, status: 'available' }
      ]
    });

    await restaurant.save();
    console.log('Restaurant created successfully');

    // Update responsable with restaurant reference
    responsable.restaurant = restaurant._id;
    await responsable.save();
    console.log('Responsable updated with restaurant reference');

    console.log('Setup completed successfully!');
    console.log('Responsable credentials:');
    console.log('Email: responsable@example.com');
    console.log('Password: responsable123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

createResponsable(); 