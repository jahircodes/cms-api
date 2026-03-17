const { getAllRolesService } = require('../services/roleService');

const getRoles = async (req, res, next) => {
  try {
    const roles = await getAllRolesService();
    res.json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRoles,
};
