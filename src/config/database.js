import dotenv from 'dotenv';

dotenv.config();

// Verifica se está rodando dentro do container
const isDocker = process.env.NODE_ENV === "docker";

export default {
  dialect: 'mariadb',
  host: isDocker ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
  port: isDocker ? process.env.DB_PORT : process.env.DB_PORT_LOCAL,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
  dialectOptions: {
    allowPublicKeyRetrieval: true, // 👈 necessário p/ MySQL 8
    ssl: false                     // garante que não tenta SSL à toa
  }
};
