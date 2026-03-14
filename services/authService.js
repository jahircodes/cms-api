const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Role, RefreshToken } = require("../models");

const login = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role }],
  });
  if (!user) throw new Error("Invalid credentials");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = jwt.sign(
    { userId: user.id, roleKey: user.Role.roleKey },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET || "refreshsecret",
    { expiresIn: "7d" },
  );
  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return { user, accessToken, refreshToken };
};

const refreshToken = async (refreshToken) => {
  const stored = await RefreshToken.findOne({ where: { token: refreshToken } });
  if (!stored || stored.expiresAt < new Date()) {
    throw new Error("Invalid or expired refresh token");
  }
  let payload;
  try {
    payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "refreshsecret",
    );
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
  const user = await User.findByPk(payload.userId, {
    include: [{ model: Role }],
  });
  if (!user) throw new Error("User not found");
  const accessToken = jwt.sign(
    { userId: user.id, roleKey: user.Role.roleKey },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "15m" },
  );
  return { accessToken, user };
};

module.exports = {
  login,
  refreshToken,
};
