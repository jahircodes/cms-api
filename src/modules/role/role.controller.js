/**
 * Role Controller
 * ---------------
 * Handles HTTP logic for role management endpoints.
 * Uses dependency injection for testability and decoupling.
 */

const { sendSuccess } = require('../../utils/response');

const buildRoleController = ({ roleService }) => {
  const createRole = async (req, res, next) => {
    try {
      const data = req.body;
      const result = await roleService.createRole(data);
      return sendSuccess(res, result, 'Role created');
    } catch (err) {
      next(err);
    }
  };

  const getRoles = async (req, res, next) => {
    try {
      const result = await roleService.getRoles();
      return sendSuccess(res, result, 'Roles retrieved');
    } catch (err) {
      next(err);
    }
  };

  const getRoleById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await roleService.getRoleById(+id);
      return sendSuccess(res, result, 'Role retrieved');
    } catch (err) {
      next(err);
    }
  };

  const updateRole = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await roleService.updateRole(+id, data);
      return sendSuccess(res, result, 'Role updated');
    } catch (err) {
      next(err);
    }
  };

  const deleteRole = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await roleService.deleteRole(+id);
      return sendSuccess(res, result, 'Role deleted');
    } catch (err) {
      next(err);
    }
  };

  return {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
  };
};

module.exports = { buildRoleController };
