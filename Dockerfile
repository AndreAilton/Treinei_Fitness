# 1 - Escolher imagem base (Node LTS)
FROM node:20

# 2 - Definir pasta de trabalho
WORKDIR /app

# 3 - Copiar package.json e package-lock.json primeiro (para aproveitar cache de dependências)
COPY package*.json ./

# 4 - Instalar dependências
RUN npm install

# 5 - Copiar todo o projeto para dentro do container
COPY . .

# 6 - Expor a porta que o Express usa
EXPOSE 3000

# 7 - Comando padrão para iniciar a API
CMD ["npm", "run", "dev"]
