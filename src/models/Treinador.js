
import { Model, DataTypes } from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class Admins extends Model {

    static init(sequelize) {
        super.init({
            nome: {
                type: DataTypes.STRING,
                allowNull: false,  // Defina se o campo pode ser nulo
                defaultValue: '',
                validate: {
                    len: {
                        args: [3, 255],
                        msg: 'O nome deve ter entre 3 e 255 caracteres'
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,  // Garantir que o email seja único
                validate: {
                    isEmail: {
                        msg: 'E-mail inválido'
                    }
                }
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            password_hash: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.VIRTUAL,
                allowNull: false,
                validate: {
                    len: {
                        args: [6, 50],
                        msg: 'A senha deve ter entre 6 e 50 caracteres'
                    }
                } 
            }
        }, {
            sequelize, // Instância do sequelize
            tableName: 'Treinador', // Nome da tabela no banco de dados
            timestamps: true, // Ativa automaticamente as colunas createdAt e updatedAt
            underscored: true, // Usa o formato snake_case para as colunas
        });

        this.addHook('beforeSave', async (user) => {
            if(user.password) {
                user.password_hash = await bcryptjs.hash(user.password, 8);
            }
        })
        return this;
    }

    checkPassword(password) {
        return bcryptjs.compare(password, this.password_hash);

    } 
    static associate(models) {
        this.hasMany(models.Exercicio, { foreignKey: 'id_treinador', as: 'exercicios' });
        this.hasMany(models.Treino, { foreignKey: 'id_treinador', as: 'treinos' });
        this.hasMany(models.UsuariosTreino, { foreignKey: 'id_treinador', as: 'usuarios_treino' });
    }
}
