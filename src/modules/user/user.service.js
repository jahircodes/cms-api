/**
 * User Service
 * ------------
 * Handles user-related business logic.
 * Uses dependency injection for decoupling and testability.
 * Does NOT handle HTTP or database access directly.
 */

const { ApiError } = require('../../shared/ApiError');
const { hashPassword, comparePassword } = require('../../utils/hash');

const createUserService = ({ userRepository, roleRepository }) => {
  const safeUserSelect = { id: true, name: true, email: true, roleId: true, createdAt: true };

  const createUser = async ({ name, email, password, roleId }) => {
    // Validate role exists
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new ApiError('Role not found', 404);
    }

    // Check if email already exists
    const existingUser = await userRepository.findFirst({ email });
    if (existingUser) {
      throw new ApiError('Email already in use', 409);
    }

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create(
      {
        name,
        email,
        password: hashedPassword,
        roleId,
      },
      { select: safeUserSelect }
    );

    return user;
  };

  const getUsers = () => userRepository.findMany({}, { select: safeUserSelect });

  const getUser = async (id) => {
    const user = await userRepository.findById(id, { select: safeUserSelect });
    if (!user) {
      throw new ApiError('User not found', 404);
    }
    return user;
  };

  const updateUser = async (id, data) => {
    await getUser(id);
    const updated = await userRepository.update({ id }, data, { select: safeUserSelect });
    return updated;
  };

  const deleteUser = async (id) => {
    await getUser(id);
    await userRepository.delete({ id });
    return { id };
  };

  const changePassword = async (userId, { currentPassword, newPassword }) => {
    // Fetch user with password field for verification
    const user = await userRepository.findById(userId, { select: { id: true, password: true } });
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      throw new ApiError('Current password is incorrect', 401);
    }

    // Hash new password and update
    const hashedPassword = await hashPassword(newPassword);
    await userRepository.update({ id: userId }, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  };

  return { createUser, getUsers, getUser, updateUser, deleteUser, changePassword };
};

module.exports = { createUserService };
