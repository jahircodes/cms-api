const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

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
    include: [{ model: Role, attributes: ['id', 'name', 'roleKey'] }],
  });

  result = result.map((user) => {
    //exlude role object and add roleName to the response
    const userData = user.toJSON();
    const { Role, ...rest } = userData; // Exclude the Role object from the response

    return {
      ...rest,
      roleName: Role.name, // Include role details in the response
    };
  });

  return result;
};

module.exports = {
  createUserService,
  getAllUsersService,
};
