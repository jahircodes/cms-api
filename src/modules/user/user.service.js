const { ApiError } = require('../../shared/ApiError');

const createUserService = ({ userRepository }) => {
  const safeUserSelect = { id: true, email: true, createdAt: true };

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

  return { getUsers, getUser, updateUser, deleteUser };
};

module.exports = { createUserService };
