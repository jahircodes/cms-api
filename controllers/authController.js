const { authService } = require("../services");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password,
    );
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      email: user.email,
      name: user.name,
      roleKey: user.Role ? user.Role.roleKey : undefined,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const { accessToken, user } = await authService.refreshToken(refreshToken);
    if (!accessToken)
      return res.status(401).json({ message: "Invalid refresh token" });
    res.json({
      accessToken,
      email: user.email,
      name: user.name,
      roleKey: user.Role ? user.Role.roleKey : undefined,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  login,
  refreshToken,
};
