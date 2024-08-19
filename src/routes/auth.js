const express = require('express');
const { body } = require('express-validator');
const AuthService = require('../services/authService');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      const user = await AuthService.register({ username, email, password, role });
      const token = user.generateAuthToken();
      res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
  try {
    const { user, token } = await AuthService.login(req.body);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/create-admin', auth, adminAuth, async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const admin = await AuthService.register({ 
        username, 
        email, 
        password,
        role: 'admin'
      });
      res.status(201).json({ message: 'Admin created successfully', admin: { id: admin.id, username: admin.username, email: admin.email, role: admin.role } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

module.exports = router;