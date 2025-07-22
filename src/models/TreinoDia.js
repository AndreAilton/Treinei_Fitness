import { Model, DataTypes } from "sequelize";

export default class TreinoDia extends Model {
  static init(sequelize) {
    super.init(
      {
        id_Treino: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "id_Treino",
        },
        Dia_da_Semana: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "Dia_da_Semana",
        },
        id_Exercicio: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "id_Exercicio",
        },
        Series: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "Series",
        },
        Repeticoes: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "Repeticoes",
        },
        Descanso: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "Descanso",
        },
        Observacoes: {
          type: DataTypes.STRING,
          field: "Observacoes",
        },
      },
      {
        sequelize,
        tableName: "TreinoDia",
        timestamps: true,
        underscored: true,
      }
    );
    return this;
  }
}
