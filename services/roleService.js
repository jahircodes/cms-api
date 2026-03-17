const { Role } = require('../models');

const getAllRolesService = async () => {
  return await Role.findAll({
    attributes: ['id', 'name', 'roleKey', 'status'],
    where: {
      status: true,
    },
  });
};

module.exports = {
  getAllRolesService,
};
