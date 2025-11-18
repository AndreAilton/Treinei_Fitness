import Usuarios from "../../models/Usuario.js";
import UsuariosTreino from "../../models/UsuariosTreino.js";
import TreinoDia from "../../models/TreinoDia.js";
import Treino from "../../models/Treino.js";
import Exercicio from "../../models/Exercicio.js";
import Files from "../../models/Files.js";
import DietaFile from "../../models/Dietas_Files.js";
import Treinador from "../../models/Treinador.js";

class UserController {
  async store(req, res) {
    try {
      const novoUser = await Usuarios.create(req.body);
      return res.status(200).json({ success: true, user: novoUser });
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        const field = e.errors && e.errors[0] && e.errors[0].path;
        if (field === "telefone") {
          return res
            .status(400)
            .json({ errors: ["Este telefone já está cadastrado."] });
        }
        if (field === "email") {
          return res
            .status(400)
            .json({ errors: ["Este e-mail já está cadastrado."] });
        }
        return res
          .status(400)
          .json({ errors: e.errors.map((error) => error.message) });
      }
      if (e.name === "SequelizeValidationError") {
        return res
          .status(400)
          .json({ errors: e.errors.map((error) => error.message) });
      }
      return res.status(400).json({
        success: false,
        message: "Erro ao criar usuário",
        error: e.message,
      });
    }
  }

  async index(req, res) {
    try {
      const usuarios = await Usuarios.findAll({
        attributes: ["id", "telefone", "nome", "email", "status"],
      });
      return res.status(200).json({ success: true, usuarios });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao listar usuários",
        error: e.message,
      });
    }
  }

  async show(req, res) {
  // Verifica se é treinador e nega acesso
  if (req.tipo === "treinador") {
    return res
      .status(403)
      .json({ success: false, message: "Acesso restrito a usuários." });
  }

  try {
    const API_HOST = process.env.API_HOST;
    const host = `${API_HOST}`;

    let user;

    // Busca inicial
    if (req.params.telefone) {
      user = await Usuarios.findOne({
        where: {
          telefone: req.params.telefone,
          status: true,
        },
        attributes: ["id", "telefone", "nome", "email", "status"],
      });
    } else if (req.userId) {
      user = await Usuarios.findOne({
        where: {
          id: req.userId,
          status: true,
        },
        attributes: ["id", "telefone", "nome", "email", "status"],
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "É necessário fornecer um telefone ou estar autenticado",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    // Busca completa com relacionamentos CORRETOS
    const userCompleto = await Usuarios.findOne({
      where: { id: user.id },
      attributes: ["id", "telefone", "nome", "email", "status"],
      include: [
        {
          model: UsuariosTreino,
          as: "usuarios_treino",
          required: false,
          include: [
            // Treino do usuário
            {
              model: Treino,
              as: "treino",
              attributes: ["id", "nome", "id_treinador"],
              include: [
                {
                  model: TreinoDia,
                  as: "treinos_dia",
                  attributes: [
                    "id",
                    "Dia_da_Semana",
                    "Series",
                    "Repeticoes",
                    "Descanso",
                  ],
                  include: [
                    {
                      model: Exercicio,
                      as: "exercicio",
                      attributes: ["id", "nome", "descricao"],
                      include: [
                        {
                          model: Files,
                          as: "videos",
                          attributes: [
                            "id",
                            "originalname",
                            "filename",
                            "category",
                            "id_exercicio",
                            "id_treinador",
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  model: Treinador,
                  foreignKey: "id_treinador",
                  attributes: ["id", "nome"],
                },
              ],
            },

            // ⚠️ AQUI SIM É O LOCAL CORRETO DA DIETA
            {
              model: DietaFile,
              as: "dieta",
              required: false,
              attributes: [
                "id",
                "originalname",
                "filename",
                "descricao",
                "mime_type",
                "id_treinador",
                "status",
              ],
            },
          ],
        },
      ],
    });

    if (!userCompleto) {
      return res.status(404).json({
        success: false,
        message: "Erro ao carregar dados completos do usuário",
      });
    }

    const userJson = userCompleto.toJSON();

    // Processa URLs dos vídeos dos exercícios
    const usuariosTreinoComVideo = (userJson.usuarios_treino || []).map((ut) => {
      if (ut.treino && ut.treino.treinos_dia) {
        ut.treino.treinos_dia = ut.treino.treinos_dia.map((td) => {
          if (td.exercicio && td.exercicio.videos) {
            td.exercicio.videos = td.exercicio.videos.map((video) => ({
              ...video,
              url: `${host}/Videos/${video.id_treinador}/${
                video.category || "nocategory"
              }/${video.filename}`,
            }));
          }
          return td;
        });
      }

      // Adiciona url da dieta
      if (ut.dieta) {
        ut.dieta.url = `${host}/Dietas/${ut.dieta.id_treinador}/${userJson.id}/${ut.dieta.filename}`;
      }

      return ut;
    });

    // resposta final
    return res.status(200).json({
      success: true,
      user: {
        ...userJson,
        usuarios_treino: usuariosTreinoComVideo,
      },
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Erro ao buscar usuário",
      error: e.message,
    });
  }
}


  async update(req, res) {
    try {
      const user = await Usuarios.findByPk(req.userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }
      await user.update(req.body);
      const { id, nome, email } = user;
      return res.status(200).json({ id, nome, email });
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        const field = e.errors && e.errors[0] && e.errors[0].path;
        if (field === "telefone") {
          return res
            .status(400)
            .json({ errors: ["Este telefone já está cadastrado."] });
        }
        if (field === "email") {
          return res
            .status(400)
            .json({ errors: ["Este e-mail já está cadastrado."] });
        }
        return res
          .status(400)
          .json({ errors: e.errors.map((error) => error.message) });
      }

      return res.status(400).json({
        success: false,
        message: "Erro ao atualizar usuário",
        error: e.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      const user = await Usuarios.findByPk(req.userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }
      user.status = false;
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Usuário desativado" });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao desativar usuário",
        error: e.message,
      });
    }
  }
}

export default new UserController();
