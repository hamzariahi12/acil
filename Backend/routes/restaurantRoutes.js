const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - city
 *         - phone
 *         - owner
 *       properties:
 *         name:
 *           type: string
 *           description: The restaurant's name
 *         address:
 *           type: string
 *           description: The restaurant's address
 *         city:
 *           type: string
 *           description: The restaurant's city
 *         phone:
 *           type: string
 *           description: The restaurant's phone number
 *         owner:
 *           type: string
 *           description: The ID of the restaurant owner
 *         openingHours:
 *           type: object
 *           properties:
 *             monday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                 close:
 *                   type: string
 *             tuesday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                 close:
 *                   type: string
 *             wednesday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                 close:
 *                   type: string
 *             thursday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                 close:
 *                   type: string
 *             friday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                 close:
 *                   type: string
 *             saturday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                 close:
 *                   type: string
 *             sunday:
 *               type: object
 *               properties:
 *                 open:
 *                   type: string
 *                 close:
 *                   type: string
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
router.get('/restaurants/my', auth, async (req, res) => {
  const restaurant = await Restaurant.findOne({ owner: req.user.id });
  if (!restaurant) {
    return res.status(404).json({ error: 'No restaurant found for this user' });
  }
  res.json(restaurant);
});

router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true })
      .populate('owner', 'name email')
      .populate('tables')
      .populate('menus');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('tables')
      .populate('menus');
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', auth, async (req, res) => {
  try {
    const restaurant = new Restaurant({
      ...req.body,
      owner: req.user._id
    });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update a restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       404:
 *         description: Restaurant not found
 */
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'address', 'phone', 'email', 'description', 'openingHours'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates!' });
  }

  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    updates.forEach(update => restaurant[update] = req.body[update]);
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    restaurant.isActive = false;
    await restaurant.save();
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restaurant by responsable ID
router.get('/responsable/:responsableId', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ responsable: req.params.responsableId });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 