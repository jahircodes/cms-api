"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("roles", "status", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("roles", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "active",
    });
  },
};
