'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make password column NOT NULL
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert password column to allow NULL
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
