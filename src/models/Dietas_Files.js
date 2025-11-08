import Sequelize, { Model } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export default class Dietas_Files extends Model {
  static init(sequelize) {
    super.init(
      {
        originalname: {
          type: Sequelize.STRING,
          defaultValue: "",
          validate: {
            notEmpty: {
              msg: "Campo não pode ficar vazio.",
            },
          },
        },
        filename: {
          type: Sequelize.STRING,
          defaultValue: "",
          validate: {
            notEmpty: {
              msg: "Campo não pode ficar vazio.",
            },
          },
        },
        descricao: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        mime_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        id_treinador: {
          type: Sequelize.INTEGER,
          references: {
            model: "Treinador",
            key: "id",
          },
        },
        id_usuario: {
          type: Sequelize.INTEGER,
          references: {
            model: "Usuarios",
            key: "id",
          },
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/Dietas/${this.id_treinador}/${this.id_usuario}/${this.filename}`;
          },
        },
      },
      {
        sequelize,
        tableName: "Dietas_Files",
        timestamps: true,
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Admins, { foreignKey: "id_treinador" });
    this.belongsTo(models.Usuarios, {
      foreignKey: "id_usuario",
      as: "usuario",
    });
  }
}
