const bcrypt = require('bcrypt');
const {
  User,
  Role,
  AuthorProfile,
  AuthorSocialLink,
  sequelize,
} = require('../models');

const createUserService = async ({ name, email, roleId }) => {
  // Check if email already exists
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    const error = new Error('Email already in use');
    error.statusCode = 409; // Conflict
    throw error;
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

/**
 * Maps a Sequelize User instance (with includes) to the public list shape.
 * @param user - User model instance with Role, AuthorProfile, AuthorSocialLinks loaded
 */
const mapUserListRow = (user) => {
  const userData = user.toJSON();
  const profileData = userData.AuthorProfile ? userData.AuthorProfile : null;
  const socialLinksData = userData.AuthorSocialLinks
    ? userData.AuthorSocialLinks
    : [];
  console.log('User Data:', userData); // Log the user data to see its structure
  const { Role, AuthorProfile, AuthorSocialLinks, ...rest } = userData;

  return {
    ...rest,
    roleName: Role.name,
    authorBio: profileData ? profileData.bio : null,
    authorSocialLinks: socialLinksData.map((link) => ({
      platform: link.platform,
      url: link.url,
    })),
  };
};

/**
 * Returns a page of users (with role, profile, social links) and pagination metadata.
 * @param {{ pageNo: number, pageSize: number }} params
 */
const getUsersService = async ({ pageNo, pageSize }) => {
  const limit = pageSize;
  const offset = (pageNo - 1) * pageSize;

  const total = await User.count();
  const rows = await User.findAll({
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
    limit,
    offset,
    order: [['id', 'ASC']],
  });

  const users = rows.map(mapUserListRow);
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

  return {
    users,
    total,
    pageNo,
    pageSize,
    totalPages,
  };
};

const changePasswordService = async ({ userId, newPassword }) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();
  return { message: 'Password changed successfully' };
};

/**
 * Updates password for the authenticated user after verifying the current password.
 * @param {{ userId: number, currentPassword: string, newPassword: string }} params
 */
const updateLoggedInUserPasswordService = async ({
  userId,
  currentPassword,
  newPassword,
}) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (!user.password) {
    const error = new Error('No password set for this account');
    error.statusCode = 400;
    throw error;
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentValid) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { message: 'Password changed successfully' };
};

const updateUserService = async ({
  name,
  userId,
  status = null,
  authorBio = null,
  authorSocialLinks = null,
}) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Update user status
    if (status !== null) {
      user.status = status;
      await user.save({ transaction });
    }

    if (name !== null) {
      user.name = name;
      await user.save({ transaction });
    }

    // Handle author profile
    if (authorBio !== null) {
      const [profile] = await AuthorProfile.findOrCreate({
        where: { userId },
        defaults: { bio: authorBio },
        transaction,
      });

      if (profile.bio !== authorBio) {
        profile.bio = authorBio;
        await profile.save({ transaction });
      }
    }

    // Handle social links
    if (authorSocialLinks !== null) {
      await AuthorSocialLink.destroy({ where: { userId }, transaction });

      if (authorSocialLinks.length > 0) {
        const links = authorSocialLinks.map((link) => ({
          userId,
          platform: link.platform,
          url: link.url,
        }));

        await AuthorSocialLink.bulkCreate(links, { transaction });
      }
    }

    await transaction.commit();

    return { message: 'User updated successfully' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteUserService = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  await user.destroy();
  return { message: 'User deleted successfully' };
};

const getLoggedInUserService = async ({ userId }) => {
  const user = await User.findOne({
    where: { id: userId },
    include: [
      { model: Role },
      { model: AuthorProfile },
      { model: AuthorSocialLink },
    ],
  });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roleKey: user.Role.roleKey,
    authorBio: user.AuthorProfile.bio,
    authorSocialLinks: user.AuthorSocialLinks.map((link) => ({
      platform: link.platform,
      url: link.url,
    })),
  };
};

module.exports = {
  createUserService,
  getUsersService,
  changePasswordService,
  updateLoggedInUserPasswordService,
  updateUserService,
  deleteUserService,
  getLoggedInUserService,
};
