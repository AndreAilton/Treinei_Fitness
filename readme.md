# Projeto API backend Agenda

Este projeto é uma API desenvolvida com Node.js e Express, utilizando MariaDB como banco de dados e Sequelize como ORM. Ele conta com autenticação JWT, upload de arquivos com Multer e gerenciamento de processos com PM2.

## Dependências

O projeto utiliza as seguintes dependências:

### Dependências principais
- `bcryptjs`: Para hash de senhas.
- `dotenv`: Para gerenciar variáveis de ambiente.
- `express`: Framework web para Node.js.
- `jsonwebtoken`: Para autenticação com JWT.
- `mariadb`: Driver para conexão com o banco MariaDB.
- `multer`: Para upload de arquivos.
- `sequelize`: ORM para manipulação do banco de dados.

### Dependências de desenvolvimento
- `nodemon`: Para reiniciar o servidor automaticamente durante o desenvolvimento.
- `pm2`: Para gerenciamento de processos em produção.
- `sequelize-cli`: Para execução de migrações.
- `sucrase`: Para utilizar ES Modules no Node.js.

## Instalação de dependencias
```node 
npm install bcryptjs dotenv express jsonwebtoken mariadb multer sequelize
npm install --save-dev nodemon pm2 sequelize-cli sucrase

```


### Estrutura Inicial
```
├───src
│   ├───config
│   ├───controllers
│   ├───database
│   │   └───migrations
│   ├───middlewares
│   ├───models
│   └───routes
└───uploads
    └───images
```

### App.js
```javascript
import express from "express";
import dotenv from "dotenv";
import path from "path";
import UserRoutes from "./routes/UserRoutes.js";
import TokenRoutes from "./routes/TokenRoutes.js";
import FileRoutes from "./routes/FileRoutes.js";
import TarefasRoutes from "./routes/TarefaRoutes.js";
import AdminRoutes from "./routes/AdminRoutes.js";
import './database/index.js'; // Essencial para Rodar o Banco de Dados
dotenv.config();

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);//Configurar Diretorios


class app {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(express.static(path.resolve(__dirname, "..", "uploads")));// Adicionar Arquivos Estaticos Para serem Acessados por http
}

    routes() {
        this.app.get("/", (req, res) => res.json("Bem Vindo a Agenda"));
        this.app.use("/users", UserRoutes);
        this.app.use("/token", TokenRoutes);
        this.app.use("/files", FileRoutes);
        this.app.use("/tarefas", TarefasRoutes);
        this.app.use("/admin", AdminRoutes);
        this.app.use("*", (req, res) => res.status(404).json({ error: "Pagina Não Encontada" }));
    }
}

export default new app().app;
```
### Server.js
``` javascript
import App from './app.js'

const port = process.env.PORT || 3000;

App.listen(port, () => console.log(`http://localhost:${port}`));

```
### Dotenv
```dotenv
DB_NAME=agenda
DB_USER=root
DB_PASS=andre
DB_HOST=localhost
DB_PORT=5000
TOKEN_SECRET=Escreva sua secret aqui
ADMIN_TOKEN_SECRET= Minha Secret Do Admin
TOKEN_EXPIRATION=7d
APP_URL=http://localhost:3000
```
---
# Configurações  
## Configurar ORM

### .Sequelize
Configurar Diretorios das configurações 
```javascript
// .Sequelize Na raiz

const { resolve } = require('path');

module.exports = {
    config: resolve(__dirname, 'src', 'config', 'database.js'),
    'models-path': resolve(__dirname, 'src', 'models'),
    'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
    'seeders-path': resolve(__dirname, 'src', 'database', 'seedes')
};
```


### database.js

Mapear Banco de Dados
```javascript
// ├───src
// │   ├───config
//         ├───database.js
import dotenv from 'dotenv';

dotenv.config();

export default {
    dialect: 'mariadb',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    logging: false,
    define: {
        timestamps: true,
        underscored: true
    }
};
```

### database/index.js
Importar Models
```javascript
// ├───src
// │   ├───database
//         ├───migrations
//         ├───index.js

import Sequelize from "sequelize";
import databaseConfig from "../config/database.js";
import User from "../models/User.js";
import Files from "../models/Files.js";
import Tarefa from "../models/Tarefas.js";
import Admin from "../models/Admin.js";

const models = [User];// Importar e Adicionar Todos os Models aqui
const connection = new Sequelize(databaseConfig);

(async () => {
  try {
    await connection.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:');
  }
})();

models.forEach((model) => model.init(connection));
models.forEach((model) => model.associate && model.associate(connection.models));
```

### Criar Migrações
 ```npx sequelize migration:generate --name Nome-da-migração```

### Modelo Tabela Usuario
```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criação da tabela de usuários
    await queryInterface.createTable('Usuarios', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Garante que o email seja único
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Define um valor padrão
      },
      
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'), // Atualiza automaticamente
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remoção da tabela de usuários
    await queryInterface.dropTable('Usuarios');
  },
}
```
### Executar Migração
 ```npx sequelize db:migrate```

### Atualizar Tabelas
Criar nova migração e Migrar

```javascript
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Usuarios', 'status', {
      type: Sequelize.BOOLEAN, // CORREÇÃO AQUI
      allowNull: false,
      defaultValue: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('Usuarios', 'status');
  },
};

```


## Criar Models
Exemplo Model Usuario
```javascript
import { Model, DataTypes } from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class Usuarios extends Model {
    static init(sequelize) {
        super.init({
            name: {
                type: DataTypes.STRING,
                allowNull: false,  // Defina se o campo pode ser nulo
                defaultValue: '',
                validate: {
                    len: {
                        args: [3, 255],
                        msg: 'O nome deve ter entre 3 e 255 caracteres'
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,  // Garantir que o email seja único
                validate: {
                    isEmail: {
                        msg: 'E-mail inválido'
                    }
                }
            },
            status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            },
            password_hash: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    len: {
                        args: [6, 50],
                        msg: 'A senha deve ter entre 6 e 50 caracteres'
                    }
                } 
            }
        }, {
            sequelize, // Instância do sequelize
            tableName: 'Usuarios', // Nome da tabela no banco de dados
            timestamps: true, // Ativa automaticamente as colunas createdAt e updatedAt
            underscored: true, // Usa o formato snake_case para as colunas
        });

        this.addHook('beforeSave', async (user) => {
            if(user.password) {
                user.password_hash = await bcryptjs.hash(user.password, 8);
            }
        })
        return this;
    }

    checkPassword(password) {
        return bcryptjs.compare(password, this.password_hash);

    }

    static associate(models) {
        this.hasMany(models.Files, { foreignKey: 'user_id' });
        this.hasMany(models.Tarefas, { foreignKey: 'user_id' });
      }
}
```

## Configurar JWT

### Controller
``` javascript
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

class TokenController{
    async store(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ error: 'Credenciais Invalidas' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'usuario Não Encontrado' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Senha Invalida' });
        }
        
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRATION
        })
        res.status(200).json({sucess: true, token});
    }
}

export default new TokenController();
```
### Middleware de Verificação
```javascript
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
    const {authorization} = req.headers;

    if (!authorization) {
        return res.status(401).json({
            errors: ['Login Required']
        })
    }
    const [ text, token] = authorization.split(' ');
    try {
        const dados = jwt.verify(token, process.env.TOKEN_SECRET)
        const {id, email} = dados

        const user = await User.findOne({
            where: {id,
                email
            }
        })

        if (!user) {
            return res.status(401).json({
                errors: ['Usuario Invalido']
            })
        }
        req.userId = id;
        req.useremail = email;
        return next();
    } catch(e) {
        return res.status(401).json({
            errors: ['Token experido ou invalido']
        })
    }
}
```
## Routes 
```javascript
// src/routes/userRoutes.js
import express from 'express';
import LoginRequire from '../middlewares/TokenRequire.js';
import UserController from '../controllers/UserController.js';  
import File from '../controllers/FilesController.js'

const router = express.Router();

router.post('/', UserController.store);
router.get('/',LoginRequire, UserController.show);
router.get('/:id',LoginRequire, UserController.show);
router.put('/', LoginRequire, UserController.update);
router.delete('/',LoginRequire, UserController.destroy, File.delete);  

export default router;
```
## Configurar Multer


### multerconfig.js
```javascript 
// ├───src
// │   ├───config
//         ├───multerconfig.js
import multer from 'multer';
import path, { extname, resolve } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new multer.MulterError('Arquivo precisa ser PNG ou JPG.'));
    }

    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const userDir = resolve(__dirname, '..', '..', 'uploads', 'images', `${req.userId}`)
      const nocategoryDir = resolve(__dirname, '..', '..', 'uploads', 'images', `${req.userId}`, 'nocategory');
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
      }

      if (!fs.existsSync(nocategoryDir)) {
        fs.mkdirSync(nocategoryDir);
      }

      cb(null, nocategoryDir);  
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`);
    },
  }),
};
```


## Docker Para Banco de dados

Arquivo docker-compose.yml
```docker
services:
  mariadb:
    image: mariadb
    restart: always
    container_name: bdmariadb1
    ports:
      - "${DB_PORT}:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASS}  # Coloquei entre aspas
      MYSQL_DATABASE: ${DB_NAME}
    volumes:
      - mariadb_data:/var/lib/mysql
volumes:
  mariadb_data:
```
### Gerar Imagem Docker
`docker compose up -d` Rodar em Segundo plano  
`docker compose up --build -d` 

### Parar Container
`docker compose stop`  
`docker compose down` 

### Deletar Container

`docker compose down --volumes`

### Logs Container 
` docker compose logs`

### Exibir Containers Ativos

` docker compose ps`