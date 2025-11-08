import { Model, DataTypes } from "sequelize";
import bcryptjs from "bcryptjs";

export default class Usuarios extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: {
          type: DataTypes.STRING,
          allowNull: false, // Defina se o campo pode ser nulo
          defaultValue: "",
          validate: {
            len: {
              args: [3, 255],
              msg: "O nome deve ter entre 3 e 255 caracteres",
            },
          },
        },
        telefone: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "O telefone não pode estar vazio",
            },
            isNumeric: {
              msg: "O telefone deve conter apenas números",
            },
            len: {
              args: [10, 11], // 10 ou 11 caracteres (sem DDD e número)
              msg: "O telefone deve ter entre 10 e 11 dígitos",
            },
            isValidPhone(value) {
              const regex = /^[0-9]{10,11}$/;
              if (!regex.test(value)) {
                throw new Error(
                  "Telefone inválido! Deve conter apenas números e ter entre 10 e 11 dígitos"
                );
              }
            },
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true, // Garantir que o email seja único
          validate: {
            isEmail: {
              msg: "E-mail inválido",
            },
          },
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
              msg: "A senha deve ter entre 6 e 50 caracteres",
            },
          },
        },
      },
      {
        sequelize, // Instância do sequelize
        tableName: "Usuarios", // Nome da tabela no banco de dados
        timestamps: true, // Ativa automaticamente as colunas createdAt e updatedAt
        underscored: true, // Usa o formato snake_case para as colunas
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcryptjs.compare(password, this.password_hash);
  }

  static associate(models) {
    this.hasMany(models.UsuariosTreino, {
      foreignKey: "id_Usuario",
      as: "usuarios_treino",
    });
    this.hasMany(models.Dietas_Files, { 
      foreignKey: 'id_usuario',
      as: 'dietas'
    });
  }
}
