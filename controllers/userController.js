const { getAllUsers } = require('../services/userService');

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
};
