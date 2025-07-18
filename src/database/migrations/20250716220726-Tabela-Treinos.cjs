'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da tabela de usuários
    await queryInterface.createTable("Treinos", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      id_treinador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Treinador', // Nome da tabela referenciada
          key: 'id', // Chave primária da tabela referenciada
        },
        onUpdate: 'CASCADE', // Atualiza em cascata
        onDelete: 'CASCADE', // Deleta em cascata
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"), // Define um valor padrão
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"), // Atualiza automaticamente
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remoção da tabela de usuários
    await queryInterface.dropTable("Treinos");
  },
};
