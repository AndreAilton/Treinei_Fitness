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
    static associate(models) {
    // Associa a tarefa com o usuário
    this.belongsTo(models.Admins, { foreignKey: 'id_treinador' });
    this.hasMany(models.TreinoDia, { foreignKey: 'id_Treino', as: 'treinos_dia' });
    this.hasMany(models.UsuariosTreino, { foreignKey: 'id_Treino', as: 'usuarios_treino' });
  }
}
