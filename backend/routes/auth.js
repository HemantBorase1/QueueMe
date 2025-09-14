const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Find admin user by username
    const adminUser = await AdminUser.findOne({ username: username.trim() });
    
    if (!adminUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check if account is active
    if (!adminUser.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }
    
    // Compare password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    adminUser.lastLogin = new Date();
    await adminUser.save();
    
    // Create and return JWT token
    const payload = {
      user: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: adminUser._id,
            username: adminUser.username,
            email: adminUser.email,
            role: adminUser.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;