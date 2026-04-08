'use strict';

/**
 * Creates media, posts, and post_media tables with indexes and foreign keys.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableOptions = {
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    };

    await queryInterface.createTable(
      'media',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        url: {
          type: Sequelize.STRING(500),
          allowNull: false,
          comment: 'Public URL served to the frontend.',
        },
        file_path: {
          type: Sequelize.STRING(500),
          allowNull: true,
          comment: 'Optional filesystem path when stored locally.',
        },
        alt_text: {
          type: Sequelize.STRING(255),
          allowNull: true,
          comment: 'Accessibility / SEO alt text for the asset.',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      tableOptions,
    );

    await queryInterface.createTable(
      'posts',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'Author; null if user removed.',
        },
        category_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'categories', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
          comment: 'Post headline.',
        },
        slug: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
          comment: 'URL-safe unique identifier for the post.',
        },
        content_json: {
          type: Sequelize.JSON,
          allowNull: false,
          comment: 'Tiptap (or compatible) document as JSON.',
        },
        content_html: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: 'Rendered HTML for display or export.',
        },
        excerpt: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'Short summary for listings and meta descriptions.',
        },
        featured_image_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'media', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'Optional hero image referencing media.id.',
        },
        status: {
          type: Sequelize.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
          allowNull: false,
          defaultValue: 'DRAFT',
          comment: 'Publication workflow state.',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          ),
        },
      },
      tableOptions,
    );

    await queryInterface.addIndex('posts', ['user_id'], {
      name: 'idx_posts_user_id',
    });
    await queryInterface.addIndex('posts', ['category_id'], {
      name: 'idx_posts_category_id',
    });
    await queryInterface.addIndex('posts', ['status'], {
      name: 'idx_posts_status',
    });
    await queryInterface.addIndex('posts', ['created_at'], {
      name: 'idx_posts_created_at',
    });

    await queryInterface.createTable(
      'post_media',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        post_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'posts', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          comment: 'Post this attachment belongs to.',
        },
        media_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'media', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          comment: 'Linked media row.',
        },
      },
      tableOptions,
    );

    await queryInterface.addIndex('post_media', ['post_id', 'media_id'], {
      unique: true,
      name: 'post_media_post_id_media_id_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('post_media');
    await queryInterface.dropTable('posts');
    await queryInterface.dropTable('media');
  },
};
