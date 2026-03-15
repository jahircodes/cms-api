const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');
const userRoutes = require('./userRoutes');

// Test route for debugging
router.get('/test', (req, res) => res.json({ ok: true }));

router.use('/auth', authRoutes);
router.use('/role', roleRoutes);
router.use('/user', userRoutes);

module.exports = router;
