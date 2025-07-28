import { Model, DataTypes } from "sequelize";

export default class UsuariosTreino extends Model {
  static init(sequelize) {
    super.init(
      {
        id_Usuario: {
          type: DataTypes.INTEGER,
          allowNull: false,

          field: "id_Usuario",
        },
        id_Treino: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "id_Treino",
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: "ativo",
        },
      },
      {
        sequelize,
        tableName: "UsuariosTreino",
        timestamps: true,
        underscored: true,
      }
    );
    return this;
  }
}
