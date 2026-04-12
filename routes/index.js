const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const roleRoutes = require('./roleRoutes');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const mediaRoutes = require('./mediaRoutes');
const postRoutes = require('./postRoutes');

// Test route for debugging
router.get('/test', (req, res) => res.json({ ok: true }));

router.use('/auth', authRoutes);
router.use('/role', roleRoutes);
router.use('/user', userRoutes);
router.use('/category', categoryRoutes);
router.use('/media', mediaRoutes);
router.use('/posts', postRoutes);

module.exports = router;
