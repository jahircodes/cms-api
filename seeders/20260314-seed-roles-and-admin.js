"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert roles
    await queryInterface.bulkInsert("roles", [
      {
        name: "ADMIN",
        role: "ADMIN",
        key: "admin",
        status: true,
      },
      {
        name: "EDITOR",
        role: "EDITOR",
        key: "editor",
        status: true,
      },
      {
        name: "AUTHOR",
        role: "AUTHOR",
        key: "author",
        status: true,
      },
      {
        name: "CONTRIBUTOR",
        role: "CONTRIBUTOR",
        key: "contributor",
        status: true,
      },
      {
        name: "SUBSCRIBER",
        role: "SUBSCRIBER",
        key: "subscriber",
        status: true,
      },
    ]);

    // Get ADMIN role id
    const [roles] = await queryInterface.sequelize.query(
      'SELECT id FROM roles WHERE name = "ADMIN" LIMIT 1;',
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
      name: ["ADMIN", "EDITOR", "AUTHOR", "CONTRIBUTOR", "SUBSCRIBER"],
    });
  },
};
