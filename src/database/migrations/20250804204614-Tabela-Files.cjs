module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Files", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      originalname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      id_treinador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Treinador", // Nome da tabela referenciada
          key: "id", // Chave primária da tabela referenciada
        },
      },
      id_exercicio: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Exercicios", // Nome da tabela referenciada
          key: "id", // Chave primária da tabela referenciada
        },
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Define um valor padrão
      },

      category: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),

  down: (queryInterface) => queryInterface.dropTable("Files"),
};
