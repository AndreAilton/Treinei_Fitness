import Exercicio from "../models/Exercicio.js";
import File from "../models/Files.js";
import multer from "multer";
import multerConfig from "../config/multerconfig.js";
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

        if (!req.file) {
          return res
            .status(400)
            .json({ success: false, message: "Arquivo não enviado" });
        }

        const { originalname, filename } = req.file;

        const novoExercicio = await Exercicio.create({
          nome,
          Categoria,
          Grupo_Muscular,
          Descricao,
          Aparelho,
          id_treinador,
        });

        const novoArquivo = await File.create({
          originalname,
          filename,
          id_exercicio: novoExercicio.id,
          id_treinador,
          category: Categoria || "nocategory",
        });

        return res.status(201).json({
          success: true,
          exercicio: novoExercicio,
          video: novoArquivo,
        });
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Erro ao criar exercício com vídeo",
          error: e.message,
        });
      }
    });
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
            attributes: ["id", "originalname", "filename", "url"],
          },
        ],
      });
      return res.status(200).json({ success: true, exercicios });
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
            attributes: ["id", "originalname", "filename", "url"],
          },
        ],
      });
      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }
      return res.status(200).json({ success: true, exercicio });
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

      // Atualiza os dados básicos do exercício
      await exercicio.update(req.body);

      // Se um novo arquivo foi enviado, substitui o antigo
      if (req.file) {
        const arquivoAntigo = await File.findOne({
          where: { id_exercicio: exercicio.id },
        });

        // Remove o arquivo antigo do sistema
        if (arquivoAntigo) {
          const caminhoAntigo = path.resolve(
            process.env.UPLOADS_PATH,
            "videos",
            `${req.treinadorId}`,
            `${arquivoAntigo.category}`,
            `${arquivoAntigo.filename}`
          );

          if (fs.existsSync(caminhoAntigo)) {
            fs.unlinkSync(caminhoAntigo);
          }

          await arquivoAntigo.destroy();
        }

        // Cria novo arquivo no banco
        const { originalname, filename } = req.file;
        const novoArquivo = await File.create({
          originalname,
          filename,
          id_exercicio: exercicio.id,
          id_treinador: req.treinadorId,
          category: req.body.Categoria || "nocategory",
        });

        return res.status(200).json({
          success: true,
          message: "Exercício e vídeo atualizados com sucesso",
          exercicio,
          novoArquivo,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Exercício atualizado com sucesso (sem alterar vídeo)",
        exercicio,
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
        // Caminho completo do arquivo (ajuste o caminho se necessário)
        const filePath = path.resolve(process.env.UPLOADS_PATH, "videos", `${req.treinadorId}`, `${arquivo.category}`, `${arquivo.filename}`);

        console.log(`Removendo arquivo: ${filePath}`);
        // Remove o arquivo do sistema de arquivos se ele existir
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Remove o registro do banco
        await arquivo.destroy();
      }

      // Remove o exercício do banco
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
