const { sendSuccess } = require('../../utils/response');

const buildUserController = ({ userService }) => {
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
      const user = await userService.getUser(req.params.id);
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  };

  const updateUser = async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      return sendSuccess(res, user, 'Updated');
    } catch (err) {
      next(err);
    }
  };

  const deleteUser = async (req, res, next) => {
    try {
      const result = await userService.deleteUser(req.params.id);
      return sendSuccess(res, result, 'Deleted');
    } catch (err) {
      next(err);
    }
  };

  return { getUsers, getUser, updateUser, deleteUser };
};

module.exports = { buildUserController };
