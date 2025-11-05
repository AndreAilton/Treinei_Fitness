# Imagem base
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos necessários para instalação das dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Define variáveis de ambiente (opcional aqui pois podem vir do .env)
ENV NODE_ENV=docker
COPY wait-for.sh /wait-for.sh
RUN sed -i 's/\r$//' /wait-for.sh
RUN chmod +x /wait-for.sh

# Expondo a porta interna da API
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
