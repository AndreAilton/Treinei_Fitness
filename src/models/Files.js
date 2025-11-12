import Sequelize, { Model } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
export default class Files extends Model {
  static init(sequelize) {
    super.init({
      originalname: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Campo não pode ficar vazio.',
          },
        },
      },
      filename: {
        type: Sequelize.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Campo não pode ficar vazio.',
          },
        },
      },
      category: {
        type: Sequelize.STRING,
        defaultValue: 'nocategory',
      
      },
      id_exercicio: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Exercicios',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${process.env.APP_URL}/Videos/${this.id_treinador}/${this.category || 'nocategory'}/${this.filename}`;
        },
      }
    }, {
      sequelize,
      tableName: 'Files',
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Treinador, { foreignKey: 'id_treinador' });
    this.belongsTo(models.Exercicio, { foreignKey: 'id_exercicio', as: 'exercicio' });
  }
}