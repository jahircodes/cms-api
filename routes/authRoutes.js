const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');

const validate = require('../middlewares/validator');
const authenticateToken = require('../middlewares/authenticateToken');
const authSchema = require('../schemas/authSchema');

router.post('/login', validate(authSchema, 'body'), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

// Protected test endpoint
router.get('/protected', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'You have accessed a protected route!',
    user: req.user,
  });
});

module.exports = router;
