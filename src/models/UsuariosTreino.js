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
          allowNull: true,
          field: "id_Treino",
        },
        
        id_Treinador: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: "id_Treinador",
        },
        treino_ativo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: "treino_ativo",
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
  static associate(models) {
    this.belongsTo(models.Treinador, { foreignKey: "id_Treinador", as: "treinador" });
    this.belongsTo(models.Treino, { foreignKey: "id_Treino", as: "treino" });
    this.belongsTo(models.Usuarios, { foreignKey: "id_Usuario", as: "usuario" });
  }
}