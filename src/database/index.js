import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";
import Usuario from "../models/Usuario.js";
import Treinador from "../models/Treinador.js";
import Exercicio from "../models/Exercicio.js";

const models = [Usuario, Treinador, Exercicio];
const connection = new Sequelize(databaseConfig);

(async () => {
  try {
    await connection.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
})();

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));

export default connection;