"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert roles
    await queryInterface.bulkInsert("roles", [
      {
        name: "Admin",
        role_key: "ADMIN",
        status: true,
      },
      {
        name: "Editor",
        role_key: "EDITOR",
        status: true,
      },
      {
        name: "Author",
        role_key: "AUTHOR",
        status: true,
      },
      {
        name: "Contributor",
        role_key: "CONTRIBUTOR",
        status: true,
      },
      {
        name: "Subscriber",
        role_key: "SUBSCRIBER",
        status: true,
      },
    ]);

    // Get ADMIN role id
    const [roles] = await queryInterface.sequelize.query(
      'SELECT id FROM roles WHERE role_key = "ADMIN" LIMIT 1;',
    );
    const adminRoleId = roles[0]?.id;

    // Hash password
    const password = await bcrypt.hash("admin123", 10);

    // Insert admin user
    await queryInterface.bulkInsert("users", [
      {
        name: "Admin",
        email: "admin@example.com",
        password: password,
        role_id: adminRoleId,
        status: true,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", { email: "admin@example.com" });
    await queryInterface.bulkDelete("roles", {
      role_key: ["ADMIN", "EDITOR", "AUTHOR", "CONTRIBUTOR", "SUBSCRIBER"],
    });
  },
};
