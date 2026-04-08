/**
 * Junction table linking posts to media for embedded or gallery attachments (many-to-many).
 */
module.exports = (sequelize, DataTypes) => {
  const PostMedia = sequelize.define(
    'PostMedia',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'Surrogate primary key for the junction row.',
      },

      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Post this attachment belongs to.',
      },

      mediaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Linked media row (delete restricted while referenced).',
      },
    },
    {
      tableName: 'post_media',
      underscored: true,
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['postId', 'mediaId'],
        },
      ],
    },
  );

  /** Registers belongs-to links for junction rows in includes. */
  PostMedia.associate = (models) => {
    PostMedia.belongsTo(models.Post, { foreignKey: 'postId' });
    PostMedia.belongsTo(models.Media, { foreignKey: 'mediaId' });
  };

  return PostMedia;
};
