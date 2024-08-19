const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { ValidationError } = require('express-validation');
const { initDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pet');
const inventoryRoutes = require('./routes/inventory');
const achievementRoutes = require('./routes/achievement');
const shopRoutes = require('./routes/shop');
const socialRoutes = require('./routes/social');
const minigameRoutes = require('./routes/minigame');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/achievement', achievementRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/minigame', minigameRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDatabase();
});

module.exports = app;