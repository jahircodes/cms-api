const { Role } = require('../models');

const getAllRoles = async () => {
  return await Role.findAll({
    attributes: ['id', 'name', 'roleKey', 'status'],
    where: {
      status: true,
    },
  });
};

module.exports = {
  getAllRoles,
};
