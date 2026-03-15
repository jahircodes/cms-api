const { User, Role } = require('../models');

const getAllUsers = async () => {
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
  getAllUsers,
};
