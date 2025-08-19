#!/bin/sh
# Espera o MariaDB iniciar antes de rodar a API
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Aguardando o banco $DB_HOST:$DB_PORT..."
  sleep 2
done

echo "Banco disponível! Rodando migrations..."
npx sequelize db:migrate


echo "Iniciando API..."
npm run start