# Imagem base
FROM node:20-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Expor a porta da API
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
