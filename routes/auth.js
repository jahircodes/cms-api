const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { login: loginSchema } = require("../schemas/authSchema");
const validate = require("../middlewares/validator");

router.post("/login", validate(loginSchema, "body"), authController.login);
router.post("/refresh", authController.refreshToken);

module.exports = router;
