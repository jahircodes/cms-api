const {
  getAllUsersService,
  createUserService,
  changePasswordService,
  updateLoggedInUserPasswordService,
  deleteUserService,
  updateUserService,
  getLoggedInUserService,
} = require('../services/userService');

const createUser = async (req, res, next) => {
  try {
    const { name, email, roleId } = req.body;

    if (!name || !email || !roleId) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }
    const { message } = await createUserService({
      name,
      email,
      roleId,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.json({ success: true, data: users });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    // Only allow the user themselves or an admin to change the password
    if (req.user.userId !== Number(userId) && req.user.roleKey !== 'ADMIN') {
      return res
        .status(403)
        .json({ success: false, message: 'Forbidden to change this password' });
    }

    await changePasswordService({
      userId: Number(userId),
      newPassword: password,
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { name, status, authorBio, authorSocialLinks } = req.body;

    console.log(name, status, authorBio, authorSocialLinks);

    // Only allow the user themselves or an admin to update
    if (req.user.userId !== Number(userId) && req.user.roleKey !== 'ADMIN') {
      return res
        .status(403)
        .json({ success: false, message: 'Forbidden to update this user' });
    }

    const { message } = await updateUserService({
      name,
      userId: Number(userId),
      status,
      authorBio,
      authorSocialLinks,
    });

    res.json({ success: true, message });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Only allow the user themselves or an admin to delete
    if (req.user.userId !== Number(userId) && req.user.roleKey !== 'ADMIN') {
      return res
        .status(403)
        .json({ success: false, message: 'Forbidden to delete this user' });
    }

    await deleteUserService(Number(userId));

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

const getLoggedInUser = async (req, res, next) => {
  try {
    const user = await getLoggedInUserService({
      userId: req.user.userId,
    });
    res.json({ success: true, data: user });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

/**
 * Changes password for the authenticated user using current and new passwords.
 */
const updateLoggedInUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await updateLoggedInUserPasswordService({
      userId: req.user.userId,
      currentPassword,
      newPassword,
    });
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    if (err.statusCode) {
      return res
        .status(err.statusCode)
        .json({ success: false, message: err.message });
    }
    next(err);
  }
};

module.exports = {
  createUser,
  getUsers,
  changePassword,
  updateLoggedInUserPassword,
  updateUser,
  deleteUser,
  getLoggedInUser,
};
