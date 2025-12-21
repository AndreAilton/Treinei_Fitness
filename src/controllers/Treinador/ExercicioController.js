import Exercicio from "../../models/Exercicio.js";
import File from "../../models/Files.js";
import multer from "multer";
import multerConfig from "../../config/multerconfig.js";
import fs from "fs";
import path from "path";

const upload = multer(multerConfig).single("file");

class ExercicioController {
  async store(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Erro no upload",
          error: err.code,
        });
      }

      try {
        const { nome, Descricao, Categoria, Grupo_Muscular, Aparelho } =
          req.body;
        const id_treinador = req.treinadorId;

        // ⛔ REMOVIDO: antes obrigava enviar arquivo
        // Agora podemos criar exercício mesmo SEM vídeo

        const novoExercicio = await Exercicio.create({
          nome,
          Categoria,
          Grupo_Muscular,
          Descricao,
          Aparelho,
          id_treinador,
        });

        // Se NÃO existir arquivo → retorna exercício sem vídeos
        if (!req.file) {
          return res.status(201).json({
            success: true,
            message: "Exercício criado sem vídeo (opcional)",
            exercicio: novoExercicio,
            videos: [],
          });
        }

        // Se existir arquivo → continua normalmente
        const { originalname, filename } = req.file;

        const novoArquivo = await File.create({
          originalname,
          filename,
          id_exercicio: novoExercicio.id,
          id_treinador,
          category: Categoria || "nocategory",
        });

        const API_HOST = process.env.API_HOST;
        const host = `${API_HOST}`;

        const videoComUrl = {
          ...novoArquivo.toJSON(),
          url: `${host}/Videos/${req.treinadorId}/${
            novoArquivo.category || "nocategory"
          }/${novoArquivo.filename}`,
        };

        return res.status(201).json({
          success: true,
          message: "Exercício criado com ou sem vídeo",
          exercicio: novoExercicio,
          videos: [videoComUrl],
        });
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Erro ao criar exercício",
          error: e.message,
        });
      }
    });
  }

  async indexpublico(req, res) {
    try {
      const exercicios = await Exercicio.findAll({
        where: { id_treinador: 1 },
        include: [
          {
            model: File,
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
      });

      const host = process.env.APP_URL;

      const result = exercicios.map((ex) => {
        const videosComUrl = ex.videos.map((video) => ({
          ...video.toJSON(),
          url: `${host}/Videos/1/${
            video.category || "nocategory"
          }/${video.filename}`,
        }));

        return {
          ...ex.toJSON(),
          videos: videosComUrl,
        };
      });

      return res.status(200).json({ success: true, exercicios: result });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao listar exercícios",
        error: e.message,
      });
    }
  }

  async index(req, res) {
    if (req.tipo !== "treinador") {
      return res
        .status(403)
        .json({ success: false, message: "Acesso restrito a treinadores." });
    }

    try {
      const exercicios = await Exercicio.findAll({
        where: { id_treinador: req.treinadorId },
        include: [
          {
            model: File,
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
      });

      const host = process.env.APP_URL;

      const result = exercicios.map((ex) => {
        const videosComUrl = ex.videos.map((video) => ({
          ...video.toJSON(),
          url: `${host}/Videos/${req.treinadorId}/${
            video.category || "nocategory"
          }/${video.filename}`,
        }));

        return {
          ...ex.toJSON(),
          videos: videosComUrl,
        };
      });

      return res.status(200).json({ success: true, exercicios: result });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao listar exercícios",
        error: e.message,
      });
    }
  }

  async show(req, res) {
    try {
      const exercicio = await Exercicio.findByPk(req.params.id, {
        include: [
          {
            model: File,
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
      });

      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }

      const host = process.env.APP_URL || "http://localhost:4000";

      const videosComUrl = exercicio.videos.map((video) => ({
        ...video.toJSON(),
        url: `${host}/Videos/${video.id_treinador}/${
          video.category || "nocategory"
        }/${video.filename}`,
      }));

      return res.status(200).json({
        success: true,
        exercicio: {
          ...exercicio.toJSON(),
          videos: videosComUrl,
        },
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao buscar exercício",
        error: e.message,
      });
    }
  }

  async update(req, res) {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Erro no upload",
          error: err.code,
        });
      }

      try {
        const exercicio = await Exercicio.findByPk(req.params.id, {
          include: [{ model: File, as: "videos" }],
        });

        if (!exercicio) {
          return res
            .status(404)
            .json({ success: false, message: "Exercício não encontrado" });
        }

        // ⇢ Atualiza dados básicos primeiro
        await exercicio.update(req.body);

        const host = process.env.APP_URL;
        const baseUploads = process.env.UPLOADS_PATH;

        // -------------------------------------------------------------
        // ⚠️ SE EXISTIR NOVO ARQUIVO → CRIAR DIRETÓRIOS E SALVAR VÍDEO
        // -------------------------------------------------------------
        if (req.file) {
          const categoria = exercicio.Categoria || "nocategory";
          const treinadorId = req.treinadorId;

          const pastaTreinador = path.resolve(
            baseUploads,
            "videos",
            `${treinadorId}`
          );
          const pastaCategoria = path.resolve(pastaTreinador, categoria);

          // ✔️ Cria pasta do treinador se não existir
          if (!fs.existsSync(pastaTreinador)) {
            fs.mkdirSync(pastaTreinador, { recursive: true });
          }

          // ✔️ Cria pasta da categoria se não existir
          if (!fs.existsSync(pastaCategoria)) {
            fs.mkdirSync(pastaCategoria, { recursive: true });
          }

          // ⚠️ Remove arquivo ANTIGO se existir
          const arquivoAntigo = await File.findOne({
            where: { id_exercicio: exercicio.id },
          });

          if (arquivoAntigo) {
            const caminhoAntigo = path.resolve(
              pastaTreinador,
              arquivoAntigo.category || "nocategory",
              arquivoAntigo.filename
            );

            if (fs.existsSync(caminhoAntigo)) fs.unlinkSync(caminhoAntigo);

            await arquivoAntigo.destroy();
          }

          // ---------------------------------------------------
          // ✔️ Salva novo arquivo no novo diretório corretamente
          // ---------------------------------------------------
          const { originalname, filename } = req.file;

          const novoArquivo = await File.create({
            originalname,
            filename,
            id_exercicio: exercicio.id,
            id_treinador: treinadorId,
            category: categoria,
          });

          const videosComUrl = [
            {
              ...novoArquivo.toJSON(),
              url: `${host}/Videos/${treinadorId}/${categoria}/${filename}`,
            },
          ];

          return res.status(200).json({
            success: true,
            message: "Exercício e vídeo atualizados com sucesso",
            exercicio,
            videos: videosComUrl,
          });
        }

        // -------------------------------------------------------------
        // ⚠️ Se NÃO mandou vídeo: retorna exercício normalmente
        // -------------------------------------------------------------
        const videosComUrl = exercicio.videos.map((video) => ({
          ...video.toJSON(),
          url: `${host}/Videos/${video.id_treinador}/${
            video.category || "nocategory"
          }/${video.filename}`,
        }));

        return res.status(200).json({
          success: true,
          message: "Exercício atualizado com sucesso (sem alterar vídeo)",
          exercicio,
          videos: videosComUrl,
        });
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Erro ao atualizar exercício",
          error: e.message,
        });
      }
    });
  }

  async destroy(req, res) {
    try {
      const exercicio = await Exercicio.findByPk(req.params.id);
      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }

      const arquivo = await File.findOne({
        where: { id_exercicio: exercicio.id },
      });

      if (arquivo) {
        const filePath = path.resolve(
          process.env.UPLOADS_PATH,
          "videos",
          `${req.treinadorId}`,
          `${arquivo.category}`,
          `${arquivo.filename}`
        );

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await arquivo.destroy();
      }

      await exercicio.destroy();

      return res.status(200).json({
        success: true,
        message: "Exercício e arquivo de vídeo removidos com sucesso",
      });
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: "Erro ao remover exercício",
        error: e.message,
      });
    }
  }
}

export default new ExercicioController();
