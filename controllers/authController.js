const { authService } = require("../services");

const logout = async (req, res, next) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token provided" });
    }
    await authService.logout(refreshToken);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password,
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    console.log("Generated Access Token:", accessToken);
    console.log("Generated Refresh Token:", refreshToken);
    console.log("User Role:", user.Role ? user.Role.roleKey : "No role");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Only GET should return data, so just return success and message for login
    res.json({
      success: true,
      message: "Login successful",
      //return access token along with user data
      data: {
        accessToken,
        id: user.id,
        name: user.name,
        email: user.email,
        roleKey: user.Role ? user.Role.roleKey : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    console.log("Refresh Token from Cookie:", req.cookies.refreshToken);
    const { refreshToken } = req.cookies;
    const { accessToken, user } = await authService.refreshToken(refreshToken);
    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }
    // Only GET should return data, so just return success and message for refresh
    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken,
        id: user.id,
        name: user.name,
        email: user.email,
        roleKey: user.Role ? user.Role.roleKey : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  refreshToken,
  logout,
};
