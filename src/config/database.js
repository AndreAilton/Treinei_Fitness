import dotenv from 'dotenv';

dotenv.config();

export default {
    dialect: 'mariadb',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
    define: {
        timestamps: true,
        underscored: true
    }
};