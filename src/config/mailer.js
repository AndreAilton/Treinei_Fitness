import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config(); 

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST, 
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true', // Se for true usa SSL, se false usa TLS
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS
  }
});

export default transport;