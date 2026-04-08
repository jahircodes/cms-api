/**
 * Media uploads: public URL for the frontend, optional local file path, and alt text.
 */
module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define(
    'Media',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'Primary key.',
      },

      url: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Public URL served to the frontend.',
      },

      filePath: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Optional filesystem path when stored locally.',
      },

      altText: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Accessibility / SEO alt text for the asset.',
      },

      createdAt: {
        type: DataTypes.DATE,
        comment: 'When this media row was created.',
      },
    },
    {
      tableName: 'media',
      underscored: true,
      timestamps: true,
      updatedAt: false,
    },
  );

  /** Registers associations for Media (featured image, post attachments). */
  Media.associate = (models) => {
    Media.hasMany(models.Post, {
      as: 'featuredInPosts',
      foreignKey: 'featuredImageId',
    });

    Media.belongsToMany(models.Post, {
      through: models.PostMedia,
      as: 'posts',
      foreignKey: 'mediaId',
      otherKey: 'postId',
    });
  };

  return Media;
};
