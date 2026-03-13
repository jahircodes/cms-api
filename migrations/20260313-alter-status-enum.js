"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change status column in roles to ENUM
    await queryInterface.changeColumn("roles", "status", {
      type: Sequelize.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    });
    // Change status column in users to ENUM
    await queryInterface.changeColumn("users", "status", {
      type: Sequelize.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert status column in roles to STRING
    await queryInterface.changeColumn("roles", "status", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    // Revert status column in users to BOOLEAN
    await queryInterface.changeColumn("users", "status", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
    // Remove ENUM types (Postgres only, safe to ignore for MySQL/SQLite)
    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_roles_status";',
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_users_status";',
      );
    }
  },
};
