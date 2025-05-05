const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const auth = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - customerName
 *         - customerEmail
 *         - customerPhone
 *         - date
 *         - time
 *         - numberOfGuests
 *         - table
 *       properties:
 *         customerName:
 *           type: string
 *           description: The name of the customer making the reservation
 *         customerEmail:
 *           type: string
 *           format: email
 *           description: The email of the customer
 *         customerPhone:
 *           type: string
 *           description: The phone number of the customer
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the reservation
 *         time:
 *           type: string
 *           format: time
 *           description: The time of the reservation
 *         numberOfGuests:
 *           type: number
 *           description: The number of guests
 *         table:
 *           type: string
 *           description: ID of the reserved table
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           default: pending
 *           description: The status of the reservation
 *         specialRequests:
 *           type: string
 *           description: Any special requests from the customer
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of all reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ isActive: true })
      .populate('table', 'number capacity')
      .sort({ date: 1, time: 1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reservations/date/{date}:
 *   get:
 *     summary: Get reservations for a specific date
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of reservations for the specified date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get('/date/:date', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({
      date: req.params.date,
      isActive: true
    }).populate('table', 'number capacity');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const session = await Reservation.startSession();
  session.startTransaction();

  try {
    // Check if table is available
    const table = await Table.findById(req.body.tableId);
    if (!table || table.status !== 'Available') {
      throw new Error('Table is not available');
    }

    // Create reservation
    const reservation = new Reservation(req.body);
    await reservation.save({ session });

    // Update table status
    table.status = 'Reserved';
    await table.save({ session });

    await session.commitTransaction();
    res.status(201).json(reservation);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

/**
 * @swagger
 * /api/reservations/{id}:
 *   patch:
 *     summary: Update a reservation
 *     tags: [Reservations]
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
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       404:
 *         description: Reservation not found
 */
// Update a reservation
router.patch('/:id', auth, async (req, res) => {
  const session = await Reservation.startSession();
  session.startTransaction();

  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // If table is being changed
    if (req.body.tableId && req.body.tableId !== reservation.tableId.toString()) {
      // Free up old table
      await Table.findByIdAndUpdate(reservation.tableId, { status: 'Available' }, { session });
      
      // Check and reserve new table
      const newTable = await Table.findById(req.body.tableId);
      if (!newTable || newTable.status !== 'Available') {
        throw new Error('New table is not available');
      }
      newTable.status = 'Reserved';
      await newTable.save({ session });
    }

    // Update reservation
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, session }
    ).populate('tableId');

    await session.commitTransaction();
    res.json(updatedReservation);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Delete a reservation
router.delete('/:id', auth, async (req, res) => {
  const session = await Reservation.startSession();
  session.startTransaction();

  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // Free up the table
    await Table.findByIdAndUpdate(
      reservation.tableId,
      { status: 'Available' },
      { session }
    );

    // Delete the reservation
    await Reservation.findByIdAndDelete(req.params.id, { session });

    await session.commitTransaction();
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

// Get reservations by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    const reservations = await Reservation.find({
      date: {
        $gte: date,
        $lt: nextDate
      }
    }).populate('tableId');
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/cnfirmed/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 