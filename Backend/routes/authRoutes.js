const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: The user's full name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         role:
 *           type: string
 *           enum: [admin, owner, staff]
 *           default: staff
 *           description: The user's role
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    console.log('Registration attempt:', { name, email, phone, role });

    // Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'staff',
      isActive: true
    });

    // Save user
    const savedUser = await user.save();
    console.log('User saved successfully:', {
      id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
        phone: savedUser.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already registered' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email });

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('Database query result:', user ? 'User found' : 'User not found');

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', { 
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });

    // Check if user is active
    if (!user.isActive) {
      console.log('User account is inactive:', email);
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Compare password with bcrypt
    console.log('Comparing password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';
    console.log('Using JWT secret:', JWT_SECRET ? 'Secret is set' : 'Using default secret');
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Token generated successfully');

    // Populate user data with restaurant and its related data
    let userWithData = user.toObject();
    if (user.restaurant) {
      const Restaurant = require('../models/Restaurant');
      const Table = require('../models/Table');
      const Menu = require('../models/Menu');
      
      // Find restaurant and populate its tables and menus
      const restaurant = await Restaurant.findById(user.restaurant)
        .populate('tables')
        .populate('menus');
      
      if (restaurant) {
        userWithData.restaurant = restaurant;
      }
    }

    console.log('Login successful for user:', email);
    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        restaurant: userWithData.restaurant
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login', error: error.message });
  }
});

// Update user profile
router.patch('/me', auth, async (req, res) => {
  try {
    const { name, email,phone } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    await user.save();

    // Renvoie les données sans le mot de passe
    const userData = user.toObject();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/auth/user/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's email
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Searching for user with email:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', email);
    res.status(200).json({ 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/create-test-user:
 *   post:
 *     summary: Create a test user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: Test user created successfully
 */
router.post('/create-test-user', async (req, res) => {
  try {
    const testUser = {
      name: 'Hamza',
      email: 'hamza@gmail.com',
      password: '22507933',
      phone: '12345678',
      role: 'client',
      isActive: true
    };

    console.log('Creating test user:', testUser.email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('Test user already exists:', testUser.email);
      // Delete existing user to create a new one
      await User.deleteOne({ email: testUser.email });
      console.log('Deleted existing test user');
    }

    // Hash the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    console.log('Password hashed successfully');
    testUser.password = hashedPassword;

    // Create new user
    const user = new User(testUser);
    await user.save();

    console.log('Test user created successfully:', testUser.email);
    res.status(201).json({ 
      message: 'Test user created successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ message: 'Error creating test user', error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Not authenticated
 */
router.get('/me', auth, async (req, res) => {
  try {
    console.log('Getting current user info for user ID:', req.user.userId);
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      console.log('User not found for ID:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.email);
    
    // Populate user data with restaurant and its related data
    let userWithData = user.toObject();
    if (user.restaurant) {
      const Restaurant = require('../models/Restaurant');
      const Table = require('../models/Table');
      const Menu = require('../models/Menu');
      
      // Find restaurant and populate its tables and menus
      const restaurant = await Restaurant.findById(user.restaurant)
        .populate('tables')
        .populate('menus');
      
      if (restaurant) {
        userWithData.restaurant = restaurant;
      }
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        restaurant: userWithData.restaurant
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

module.exports = router; 