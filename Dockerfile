# Imagem base
FROM node:20

# --- ADIÇÃO: Instala o FFmpeg no sistema operacional do container ---
# O 'rm -rf' no final serve para limpar o cache e deixar a imagem mais leve
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos necessários para instalação das dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Define variáveis de ambiente
ENV NODE_ENV=docker

# Configuração do script wait-for (mantive sua lógica de limpeza de quebra de linha do Windows)
COPY wait-for.sh /wait-for.sh
RUN sed -i 's/\r$//' /wait-for.sh
RUN chmod +x /wait-for.sh

# Expondo a porta interna da API
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]