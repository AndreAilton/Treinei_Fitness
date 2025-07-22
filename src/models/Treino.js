import { Model, DataTypes } from "sequelize";

export default class Treino extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        id_treinador: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "Treinos",
        timestamps: true,
        underscored: true,
      }
    );
    return this;
  }
}
