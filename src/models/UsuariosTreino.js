import { Model, DataTypes } from "sequelize";

export default class UsuariosTreino extends Model {
  static init(sequelize) {
    super.init(
      {
        id_usuario: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        id_treinador: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        id_treino: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        ativo: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },

        created_at: {
          type: DataTypes.DATE,
        },

        updated_at: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        tableName: "UsuariosTreino",
        underscored: true, // usa snake_case automaticamente
        timestamps: false, // porque já existem created_at e updated_at no DB
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuarios, {
      foreignKey: "id_usuario",
      as: "usuario",
    });

    this.belongsTo(models.Treinador, {
      foreignKey: "id_treinador",
      as: "treinador",
    });

    this.belongsTo(models.Treino, {
      foreignKey: "id_treino",
      as: "treino",
    });
  }
}
