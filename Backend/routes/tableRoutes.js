const express = require('express');
const router = express.Router();
const Table = require('../models/Table');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       required:
 *         - number
 *         - capacity
 *         - restaurant
 *       properties:
 *         number:
 *           type: number
 *           description: The table number
 *         capacity:
 *           type: number
 *           description: The maximum number of people the table can accommodate
 *         status:
 *           type: string
 *           enum: [available, occupied, reserved]
 *           default: available
 *           description: The current status of the table
 *         restaurant:
 *           type: string
 *           description: ID of the restaurant this table belongs to
 */

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Get all tables
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: List of all tables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 */
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/tables/restaurant/{restaurantId}:
 *   get:
 *     summary: Get all tables for a specific restaurant
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tables for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Table'
 */
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const tables = await Table.find({ 
      restaurant: req.params.restaurantId,
      isActive: true 
    });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/tables:
 *   post:
 *     summary: Create a new table
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Table'
 *     responses:
 *       201:
 *         description: Table created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', auth, async (req, res) => {
  try {
    const table = new Table(req.body);
    const newTable = await table.save();
    res.status(201).json(newTable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/tables/{id}:
 *   patch:
 *     summary: Update a table's status
 *     tags: [Tables]
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, occupied, reserved]
 *     responses:
 *       200:
 *         description: Table updated successfully
 *       404:
 *         description: Table not found
 */
router.patch('/:id', auth, async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json(table);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/tables/{id}:
 *   delete:
 *     summary: Delete a table (soft delete)
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table deleted successfully
 *       404:
 *         description: Table not found
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!table) return res.status(404).json({ message: 'Table not found' });
    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available tables
router.get('/available', async (req, res) => {
  try {
    const tables = await Table.find({ status: 'Available', isActive: true });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 