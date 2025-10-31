FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# Instalar netcat corretamente
RUN apt-get update && apt-get install -y netcat-openbsd

COPY . .

# Converter CRLF para LF e dar permissão de execução
RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
