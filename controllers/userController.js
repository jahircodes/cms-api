const {
  getAllUsersService,
  createUserService,
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
    if (err.message === 'Email already in use') {
      return res.status(409).json({ success: false, message: err.message });
    }
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  getUsers,
};
