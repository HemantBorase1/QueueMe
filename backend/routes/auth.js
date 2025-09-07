const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple in-memory admin credentials (for demo purposes)
// In production, use a proper user database
const adminCredentials = {
  username: 'admin',
  password: '$2a$10$rOzZcZNB5BzUesV7F4L.5.FsKZ7kC5nT5JvW8nLzQ5p5nVvL5J5XG' // "password123" hashed
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username !== adminCredentials.username) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // In a real app, you would compare with hashed password from database
    const isMatch = await bcrypt.compare(password, adminCredentials.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create and return JWT token
    const payload = {
      user: {
        id: 'admin',
        role: 'admin'
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;