import Treinador from "../../models/Treinador.js";
import Exercicio from "../../models/Exercicio.js";
import Treino from "../../models/Treino.js";
import UsuariosTreino from "../../models/UsuariosTreino.js";
import Usuarios from "../../models/Usuario.js";

class TreinadorController {
  async store(req, res) {
    try {
      const novoTreinador = await Treinador.create(req.body);
      return res.status(200).json({ success: true, treinador: novoTreinador });
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ errors: ["Este e-mail já está cadastrado."] });
      }
      if (e.name === "SequelizeValidationError") {
        return res
          .status(400)
          .json({ errors: e.errors.map((err) => err.message) });
      }
      return res.status(400).json({
        success: false,
        message: "Erro ao criar treinador",
        error: e.message,
      });
    }
  }

  async index(req, res) {
    try {
      const treinadores = await Treinador.findAll({
        attributes: ["id", "nome", "email", "status"],
      });
      return res.status(200).json({ success: true, treinadores });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao listar treinadores",
        error: e.message,
      });
    }
  }

  async show(req, res) {
    if (req.tipo !== "treinador") {
      return res
        .status(403)
        .json({ success: false, message: "Acesso restrito a treinadores." });
    }
    try {
      const API_HOST = process.env.API_HOST;
      const host = `${API_HOST}`;

      const treinador = await Treinador.findByPk(req.userId, {
        attributes: ["id", "nome", "email", "status"],
        include: [
          {
            model: Exercicio,
            as: "exercicios",
            include: [
              {
                model: Exercicio.associations.videos.target, // Associa o model File
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
          {
            model: Treino,
            as: "treinos",
            attributes: ["id", "nome"],
          },
          {
            model: UsuariosTreino,
            as: "usuarios_treino",
            attributes: ["id"],
            include: [
              {
                model: Treino,
                as: "treino",
                attributes: ["id", "nome"],
              },
              {
                model: Usuarios,
                as: "usuario",
                attributes: ["id", "nome", "email"],
              },
            ],
          },
        ],
      });

      if (!treinador) {
        return res
          .status(404)
          .json({ success: false, message: "Treinador não encontrado" });
      }
      if (treinador.status === false) {
        return res
          .status(400)
          .json({ success: false, message: "Treinador desativado" });
      }

      // Adiciona a URL dinâmica para todos os vídeos de cada exercício
      const exerciciosComVideos = treinador.exercicios.map((ex) => {
        const videosComUrl = ex.videos.map((video) => ({
          ...video.toJSON(),
          url: `${host}/Videos/${video.id_treinador}/${
            video.category || "nocategory"
          }/${video.filename}`,
        }));
        return {
          ...ex.toJSON(),
          videos: videosComUrl,
        };
      });

      return res.status(200).json({
        success: true,
        treinador: {
          ...treinador.toJSON(),
          exercicios: exerciciosComVideos,
        },
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar treinador",
        error: e.message,
      });
    }
  }

  async update(req, res) {
    if (req.tipo !== "treinador") {
      return res
        .status(403)
        .json({ success: false, message: "Acesso restrito a treinadores." });
    }
    try {
      const treinador = await Treinador.findByPk(req.userId);
      if (!treinador) {
        return res
          .status(404)
          .json({ success: false, message: "Treinador não encontrado" });
      }
      await treinador.update(req.body);
      const { id, nome, email } = treinador;
      return res.status(200).json({ id, nome, email });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao atualizar treinador",
        error: e.message,
      });
    }
  }

  async destroy(req, res) {
    if (req.tipo !== "treinador") {
      return res
        .status(403)
        .json({ success: false, message: "Acesso restrito a treinadores." });
    }
    try {
      const treinador = await Treinador.findByPk(req.userId);
      if (!treinador) {
        return res
          .status(404)
          .json({ success: false, message: "Treinador não encontrado" });
      }
      treinador.status = false;
      await treinador.save();
      return res
        .status(200)
        .json({ success: true, message: "Treinador desativado" });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao desativar treinador",
        error: e.message,
      });
    }
  }
}

export default new TreinadorController();
