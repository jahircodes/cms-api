const { getRolesService } = require('../services/roleService');

/**
 * Lists active roles with pagination (query: pageNo, pageSize on req.validatedQuery).
 */
const getRoles = async (req, res, next) => {
  try {
    const { pageNo, pageSize } = req.validatedQuery;
    const result = await getRolesService({ pageNo, pageSize });
    res.json({
      success: true,
      data: result.roles,
      pagination: {
        pageNo: result.pageNo,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRoles,
};
