/**
 * Role Service
 * ------------
 * Handles role-related business logic.
 * Uses dependency injection for decoupling and testability.
 * Does NOT handle HTTP or database access directly.
 */

const { ApiError } = require('../../shared/ApiError');

const createRoleService = ({ roleRepository }) => {
  const createRole = async ({ name, roleKey, status }) => {
    const existingByName = await roleRepository.findOne({ name });
    if (existingByName) {
      throw new ApiError('Role with this name already exists', 409);
    }

    const existingByKey = await roleRepository.findByRoleKey(roleKey);
    if (existingByKey) {
      throw new ApiError('Role with this key already exists', 409);
    }

    const role = await roleRepository.create({
      name,
      roleKey,
      status: status || 'ACTIVE',
    });
    return role;
  };

  const getRoles = async () => {
    return roleRepository.findMany();
  };

  const getRoleById = async (id) => {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new ApiError('Role not found', 404);
    }
    return role;
  };

  const updateRole = async (id, { name, roleKey, status }) => {
    const existing = await roleRepository.findById(id);
    if (!existing) {
      throw new ApiError('Role not found', 404);
    }

    // Check if name is being changed and if new name already exists
    if (name && name !== existing.name) {
      const existingByName = await roleRepository.findOne({ name });
      if (existingByName) {
        throw new ApiError('Role with this name already exists', 409);
      }
    }

    // Check if roleKey is being changed and if new key already exists
    if (roleKey && roleKey !== existing.roleKey) {
      const existingByKey = await roleRepository.findByRoleKey(roleKey);
      if (existingByKey) {
        throw new ApiError('Role with this key already exists', 409);
      }
    }

    const role = await roleRepository.update(
      { id },
      {
        name,
        roleKey,
        status,
      }
    );
    return role;
  };

  const deleteRole = async (id) => {
    const existing = await roleRepository.findById(id);
    if (!existing) {
      throw new ApiError('Role not found', 404);
    }
    await roleRepository.delete({ id });
    return { id };
  };

  return {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
  };
};

module.exports = { createRoleService };
