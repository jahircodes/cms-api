module.exports = (sequelize, DataTypes) => {
  const AuthorProfile = sequelize.define(
    'AuthorProfile',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      avatarUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: 'author_profiles',
      timestamps: true,
      underscored: true,
    },
  );

  AuthorProfile.associate = (models) => {
    AuthorProfile.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return AuthorProfile;
};
