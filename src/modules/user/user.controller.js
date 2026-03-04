/**
 * User Controller
 * ---------------
 * Handles HTTP logic for user management endpoints.
 * Uses dependency injection for testability and decoupling.
 */

const { sendSuccess } = require('../../utils/response');

const buildUserController = ({ userService }) => {
  const adminCreateUser = async (req, res, next) => {
    try {
      const { name, email, password, roleKey } = req.body;
      const user = await userService.createUserByRoleKey({ name, email, password, roleKey });
      return sendSuccess(res, user, 'User created successfully', 201);
    } catch (err) {
      next(err);
    }
  };

  const getUsers = async (req, res, next) => {
    try {
      const users = await userService.getUsers();
      return sendSuccess(res, users);
    } catch (err) {
      next(err);
    }
  };

  const getUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.getUser(id);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  };

  const updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await userService.updateUser(id, data);
      return sendSuccess(res, user, 'Updated');
    } catch (err) {
      next(err);
    }
  };

  const deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      return sendSuccess(res, result, 'Deleted');
    } catch (err) {
      next(err);
    }
  };

  const changePassword = async (req, res, next) => {
    try {
      const userId = req.user.sub;
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(userId, { currentPassword, newPassword });
      return sendSuccess(res, result, 'Password changed successfully');
    } catch (err) {
      next(err);
    }
  };

  return { adminCreateUser, getUsers, getUser, updateUser, deleteUser, changePassword };
};

module.exports = { buildUserController };
