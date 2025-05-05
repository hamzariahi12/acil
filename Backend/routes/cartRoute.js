const express = require('express');
const Cart = require('../models/cart.js');



const router = express.Router();
router.post('/', async (req, res) => {
    try {
  
      console.log('Registration attempt:', { });
  
      // Validate input
      /*if (!userId || !restaurantId || ) {
        return res.status(400).json({ message: 'All fields are required' });

      }await cart.save()*/
        const cart = new Cart(req.body);
        await cart.save();
        res.json({ message: 'Cart created successfully',cart });
    }
     catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'An error occurred during registration', error: error.message });
         }
        });

// Get cart by userId and restaurantId

        router.get('/user/:userId/restaurant/:restaurantId', async (req, res) => {
          try {
            const { userId, restaurantId } = req.query;
        
            // Validate required query parameters
            if (!userId || !restaurantId) {
              return res.status(400).json({ message: 'userId and restaurantId are required' });
            }
        
            // Find the cart
            const cart = await Cart.findOne({ user: userId, restaurant: restaurantId });
        
            if (!cart) {
              return res.status(404).json({ message: 'Cart not found' });
            }
        
            res.json(cart);
          } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
          }
        });

        module.exports = router; 