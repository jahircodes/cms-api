/**
 * CMS posts: Tiptap JSON/HTML body, optional excerpt, featured image, and publish status.
 */
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'Primary key.',
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Author; null if user removed (ON DELETE SET NULL).',
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Required category for the post.',
      },

      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Post headline.',
      },

      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'URL-safe unique identifier (set by client).',
      },

      contentJson: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'Tiptap (or compatible) document as JSON.',
      },

      contentHtml: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Rendered HTML for display or export.',
      },

      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Short summary for listings and meta descriptions.',
      },

      featuredImageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Optional hero image referencing media.id.',
      },

      status: {
        type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
        allowNull: false,
        defaultValue: 'DRAFT',
        comment: 'Publication workflow state.',
      },

      createdAt: {
        type: DataTypes.DATE,
        comment: 'When the post was first created.',
      },

      updatedAt: {
        type: DataTypes.DATE,
        comment: 'When the post was last updated.',
      },
    },
    {
      tableName: 'posts',
      underscored: true,
      timestamps: true,
      indexes: [
        { fields: ['userId'] },
        { fields: ['categoryId'] },
        { fields: ['status'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  /** Registers associations for Post (author, category, featured image, attached media). */
  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'userId' });
    Post.belongsTo(models.Category, { foreignKey: 'categoryId' });
    Post.belongsTo(models.Media, {
      as: 'featuredImage',
      foreignKey: 'featuredImageId',
    });

    Post.belongsToMany(models.Media, {
      through: models.PostMedia,
      as: 'attachedMedia',
      foreignKey: 'postId',
      otherKey: 'mediaId',
    });
  };

  return Post;
};
