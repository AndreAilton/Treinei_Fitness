"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da tabela de usuários
    await queryInterface.createTable("UsuariosTreino", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_Usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Garante que cada usuário só possa receber um treino por vez
        references: {
          model: "Usuarios", // Nome da tabela referenciada
          key: "id", // Chave primária da tabela referenciada
        },
        onUpdate: "CASCADE", // Atualiza em cascata
        onDelete: "CASCADE", // Deleta em cascata
      },
      id_Treino: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Treinos", // Nome da tabela referenciada
          key: "id", // Chave primária da tabela referenciada
        },
        onUpdate: "CASCADE", // Atualiza em cascata
        onDelete: "CASCADE", // Deleta em cascata
      },
      id_Treinador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Treinador", // Nome da tabela referenciada
          key: "id", // Chave primária da tabela referenciada
        },
        onUpdate: "CASCADE", // Atualiza em cascata
        onDelete: "CASCADE", // Deleta em cascata
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Define um valor padrão
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
    await queryInterface.dropTable("UsuariosTreino");
  },
};