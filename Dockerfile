FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

EXPOSE 3000

CMD ["/wait-for.sh", "mariadb:3306", "--", "npm", "run", "start"]
