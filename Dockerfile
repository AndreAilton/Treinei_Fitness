# Base Node LTS
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o projeto
COPY . .

# Copiar wait-for-it
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Expor porta do Express
EXPOSE 3000

# Comando default (espera banco e inicia API)
CMD ["./wait-for-it.sh", "mariadb:3306", "--", "npm", "run", "start"]
