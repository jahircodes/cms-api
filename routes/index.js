const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");

// Test route for debugging
router.get("/test", (req, res) => res.json({ ok: true }));

router.use("/auth", authRoutes);

module.exports = router;
