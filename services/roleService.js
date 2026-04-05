const { Role } = require('../models');

/**
 * Returns a page of active roles and pagination metadata.
 * @param {{ pageNo: number, pageSize: number }} params
 */
const getRolesService = async ({ pageNo, pageSize }) => {
  const limit = pageSize;
  const offset = (pageNo - 1) * pageSize;

  const { count, rows } = await Role.findAndCountAll({
    attributes: ['id', 'name', 'roleKey', 'status'],
    where: {
      status: true,
    },
    limit,
    offset,
    order: [['id', 'ASC']],
  });

  const totalPages = pageSize > 0 ? Math.ceil(count / pageSize) : 0;

  return {
    roles: rows,
    total: count,
    pageNo,
    pageSize,
    totalPages,
  };
};

module.exports = {
  getRolesService,
};
