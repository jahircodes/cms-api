const bcrypt = require('bcrypt');
const { User, Role, AuthorProfile, AuthorSocialLink } = require('../models');

const createUserService = async ({ name, email, roleId }) => {
  // Check if email already exists
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    throw new Error('Email already in use');
  }

  // Create user
  await User.create({
    name,
    email,
    roleId,
    status: true,
  });

  //return succesful message
  return {
    message: 'User created successfully',
  };
};

const getAllUsersService = async () => {
  let result = await User.findAll({
    attributes: ['id', 'name', 'email', 'mobileNumber', 'status', 'roleId'],
    include: [
      { model: Role, attributes: ['id', 'name', 'roleKey'] },
      {
        model: AuthorProfile,
        attributes: ['id', 'bio'],
      },
      {
        model: AuthorSocialLink,
        attributes: ['id', 'platform', 'url'],
      },
    ],
  });

  result = result.map((user) => {
    //exlude role object and add roleName to the response
    const userData = user.toJSON();
    console.log('User Data:', userData); // Log the user data to see its structure
    const { Role, ...rest } = userData; // Exclude the Role object from the response

    return {
      ...rest,
      roleName: Role.name, // Include role details in the response
    };
  });

  return result;
};

const changePasswordService = async ({ userId, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  return { message: 'Password changed successfully' };
};

const deleteUserService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  await user.destroy();
  return { message: 'User deleted successfully' };
};

module.exports = {
  createUserService,
  getAllUsersService,
  changePasswordService,
  deleteUserService,
};
