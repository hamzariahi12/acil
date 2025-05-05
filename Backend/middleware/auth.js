const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      console.log('User account is inactive');
      return res.status(401).json({ message: 'Account is inactive' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = auth; 