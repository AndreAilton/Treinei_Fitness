FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

# Instalar netcat corretamente
RUN apt-get update && apt-get install -y netcat-openbsd

COPY . .

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
