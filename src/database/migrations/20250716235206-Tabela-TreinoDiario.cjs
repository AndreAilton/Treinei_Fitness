'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da tabela de usuários
    await queryInterface.createTable("TreinoDia", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      id_Treino: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Treinos', // Nome da tabela referenciada
          key: 'id', // Chave primária da tabela referenciada
        },
        onUpdate: 'CASCADE', // Atualiza em cascata
        onDelete: 'CASCADE', // Deleta em cascata
      },
      Dia_da_Semana: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_Exercicio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Exercicios', // Nome da tabela referenciada
          key: 'id', // Chave primária da tabela referenciada
        },
        onUpdate: 'CASCADE', // Atualiza em cascata
        onDelete: 'CASCADE', // Deleta em cascata
      },
      Series: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Repeticoes: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Descanso: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Observacoes: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("TreinoDia");
  },
};
