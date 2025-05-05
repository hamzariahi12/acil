const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - price
 *         - description
 *         - image
 *         - restaurant
 *         - items
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the menu
 *         category:
 *           type: string
 *           description: The category of the menu
 *         price:
 *           type: number
 *           description: The price of the menu
 *         description:
 *           type: string
 *           description: The description of the menu
 *         image:
 *           type: string
 *           description: URL of the menu image
 *         restaurant:
 *           type: string
 *           description: ID of the restaurant
 *         items:
 *           type: array
 *           items:
 *             type: string
 *           description: List of items in the menu
 */

/**
 * @swagger
 * /api/menus:
 *   get:
 *     summary: Get all active menus
 *     tags: [Menus]
 *     responses:
 *       200:
 *         description: List of all active menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 */
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find({ isActive: true });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/menus:
 *   post:
 *     summary: Create a new menu
 *     tags: [Menus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       201:
 *         description: Menu created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const menu = new Menu(req.body);
  try {
    const newMenu = await menu.save();
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/menus/{id}:
 *   patch:
 *     summary: Update a menu
 *     tags: [Menus]
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
 *             $ref: '#/components/schemas/Menu'
 *     responses:
 *       200:
 *         description: Menu updated successfully
 *       404:
 *         description: Menu not found
 */
router.patch('/:id', auth, async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json(menu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/menus/{id}:
 *   delete:
 *     summary: Delete a menu (soft delete)
 *     tags: [Menus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Menu deleted successfully
 *       404:
 *         description: Menu not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!menu) return res.status(404).json({ message: 'Menu not found' });
    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 