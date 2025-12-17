// migrations/XXXXXXXXXXXXXX-add-reset-password-to-users.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Usuarios', 'password_reset_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Usuarios', 'password_reset_expires', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Usuarios', 'password_reset_token');
    await queryInterface.removeColumn('Usuarios', 'password_reset_expires');
  }
};