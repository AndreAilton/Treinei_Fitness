import Usuarios from "../../models/Usuario.js";
import UsuariosTreino from "../../models/UsuariosTreino.js";
import TreinoDia from "../../models/TreinoDia.js";
import Treino from "../../models/Treino.js";
import Exercicio from "../../models/Exercicio.js";
import Files from "../../models/Files.js";
import DietaFile from "../../models/Dietas_Files.js"; // Adicione este import

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
    try {
      const API_HOST = process.env.API_HOST;
      const host = `${API_HOST}`;

      const { telefone } = req.params;

      // define include reutilizável para treinos
      const includeTreinos = [
        {
          model: UsuariosTreino,
          as: "usuarios_treino",
          attributes: ["id"],
          include: [
            {
              model: Treino,
              as: "treino",
              attributes: ["id", "nome"],
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
              ],
            },
          ],
        },
      ];

      // define include para dietas
      const includeDietas = [
        {
          model: DietaFile,
          as: "dietas",
          attributes: [
            "id",
            "originalname",
            "filename",
            "descricao",
            "mime_type",
            "id_treinador",
            "status",
          ],
          where: { status: true }, // Apenas dietas ativas
        },
      ];

      // Busca por telefone ou userId com includes
      let user;
      if (telefone) {
        user = await Usuarios.findOne({
          where: { telefone },
          attributes: ["id", "telefone", "nome", "email", "status"],
          include: [...includeTreinos, ...includeDietas],
        });
      } else {
        if (!req.userId) {
          return res
            .status(403)
            .json({ success: false, message: "Acesso restrito." });
        }

        user = await Usuarios.findByPk(req.userId, {
          attributes: ["id", "telefone", "nome", "email", "status"],
          include: [...includeTreinos, ...includeDietas],
        });
      }

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
      }
      if (user.status === false) {
        return res
          .status(400)
          .json({ success: false, message: "Usuário desativado" });
      }

      // Adiciona URL dinâmica em todos os vídeos (mantém código existente)
      const usuariosTreinoComVideo = (user.usuarios_treino || []).map((ut) => {
        const treino = ut.treino || {};
        const treinosDiaComVideo = (treino.treinos_dia || []).map((td) => {
          const exercicio = td.exercicio || {};
          const videosComUrl = (exercicio.videos || []).map((video) => ({
            ...video.toJSON(),
            url: `${host}/Videos/${video.id_treinador}/${
              video.category || "nocategory"
            }/${video.filename}`,
          }));

          return {
            ...td.toJSON(),
            exercicio: {
              ...exercicio.toJSON(),
              videos: videosComUrl,
            },
          };
        });

        return {
          ...ut.toJSON(),
          treino: {
            ...treino.toJSON(),
            treinos_dia: treinosDiaComVideo,
          },
        };
      });

      // Adiciona URL dinâmica para dietas
      const dietasComUrl = (user.dietas || []).map((dieta) => ({
        ...dieta.toJSON(),
        url: `${host}/Dietas/${dieta.id_treinador}/${user.id}/${dieta.filename}`,
      }));

      return res.status(200).json({
        success: true,
        user: {
          ...user.toJSON(),
          usuarios_treino: usuariosTreinoComVideo,
          dietas: dietasComUrl,
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
