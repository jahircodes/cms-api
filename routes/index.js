const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');

// Test route for debugging
router.get('/test', (req, res) => res.json({ ok: true }));

router.use('/auth', authRoutes);
router.use('/role', roleRoutes);
router.use('/user', userRoutes);
router.use('/category', categoryRoutes);

module.exports = router;
