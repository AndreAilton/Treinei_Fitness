FROM node:20

# Definir diretório de trabalho no container
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos
COPY . .

# Expor a porta que sua API usa
EXPOSE 3000

# Comando para iniciar a API
