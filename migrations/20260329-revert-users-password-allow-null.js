'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Revert password column to allow NULL (undo previous NOT NULL change)
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Make password column NOT NULL again
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
