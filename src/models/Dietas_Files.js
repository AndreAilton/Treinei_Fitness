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
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/Dietas/${this.id_treinador}/${this.filename}`;
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
    this.belongsTo(models.Treinador, { foreignKey: "id_treinador" });

  }
}
