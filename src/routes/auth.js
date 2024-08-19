const express = require('express');
const { body } = require('express-validator');
const AuthService = require('../services/authService');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register', 
  validate([
    body('username').isLength({ min: 3 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 })
  ]),
  async (req, res) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.post('/login', async (req, res) => {
  try {
    const { user, token } = await AuthService.login(req.body);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;