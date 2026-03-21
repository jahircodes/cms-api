module.exports = (sequelize, DataTypes) => {
  const AuthorSocialLink = sequelize.define(
    'AuthorSocialLink',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      platform: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      tableName: 'author_social_links',
      timestamps: true,
      underscored: true,
    },
  );

  AuthorSocialLink.associate = (models) => {
    AuthorSocialLink.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return AuthorSocialLink;
};
