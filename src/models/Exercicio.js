import { Model, DataTypes } from "sequelize";

export default class Exercicio extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        Categoria: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        Grupo_Muscular: {
          type: DataTypes.STRING,
          allowNull: false,
            field: "Grupo_Muscular", // Use 'Grupo_Muscular' to match the migration
        },
        Descricao: {
          type: DataTypes.STRING,
          allowNull: false,
            field: "Descricao", // Use 'Descricao' to match the migration
        },
        id_treinador: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Aparelho: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: "Exercicios",
        timestamps: true,
        underscored: true,
      }
    );
    return this;
  }
  static associate(models) {
    // Associa a tarefa com o usuário
    this.belongsTo(models.Treinador, { foreignKey: 'id_treinador' });
    this.hasMany(models.Files, { foreignKey: 'id_exercicio', as: 'videos' });
  }
}


