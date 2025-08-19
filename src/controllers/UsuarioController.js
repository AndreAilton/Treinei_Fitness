import Usuarios from "../models/Usuario.js";
import UsuariosTreino from "../models/UsuariosTreino.js";
import TreinoDia from "../models/TreinoDia.js";
import Treino from "../models/Treino.js";
import Exercicio from "../models/Exercicio.js";
import Files from "../models/Files.js";

class UserController {
  async store(req, res) {
    try {
      const novoUser = await Usuarios.create(req.body);
      return res.status(200).json({ success: true, user: novoUser });
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ errors: ["Este e-mail já está cadastrado."] });
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
        attributes: ["id", "nome", "email", "status"],
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
    if (req.tipo !== "usuario") {
      return res
        .status(403)
        .json({ success: false, message: "Acesso restrito a usuários." });
    }

    try {
        const API_HOST = process.env.API_HOST
        const host = `${API_HOST}`;

      const user = await Usuarios.findByPk(req.userId, {
        attributes: ["id", "nome", "email", "status"],
        include: [
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
        ],
      });

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

      // Adiciona URL dinâmica em todos os vídeos
      const usuariosTreinoComVideo = user.usuarios_treino.map((ut) => {
        const treino = ut.treino;
        const treinosDiaComVideo = treino.treinos_dia.map((td) => {
          const exercicio = td.exercicio;
          const videosComUrl = exercicio.videos.map((video) => ({
            ...video.toJSON(),
            url: `${host}/Videos/${video.id_treinador}/${
              video.category || "nocategory"
            }/${video.filename}`,
          }));

          return {
            ...td.toJSON(),
            exercicio: {
              ...exercicio.toJSON(),
              videos: videosComUrl, // mantém o array de vídeos original com URLs
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

      return res.status(200).json({
        success: true,
        user: {
          ...user.toJSON(),
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
