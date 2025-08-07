import Exercicio from "../models/Exercicio.js";
import File from "../models/Files.js";
import multer from "multer";
import multerConfig from "../config/multerconfig.js";

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
      const { nome, Descricao, Categoria, Grupo_Muscular, Aparelho } = req.body;
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
      const exercicios = await Exercicio.findAll();
      return res.status(200).json({ success: true, exercicios });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao listar exercícios",
          error: e.message,
        });
    }
  }

  async show(req, res) {
    
    try {
      const exercicio = await Exercicio.findByPk(req.params.id);
      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }
      return res.status(200).json({ success: true, exercicio });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao buscar exercício",
          error: e.message,
        });
    }
  }

  async update(req, res) {
    try {
      const exercicio = await Exercicio.findByPk(req.params.id);
      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }
      await exercicio.update(req.body);
      return res.status(200).json({ success: true, exercicio });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao atualizar exercício",
          error: e.message,
        });
    }
  }

  async destroy(req, res) {
    try {
      const exercicio = await Exercicio.findByPk(req.params.id);
      if (!exercicio) {
        return res
          .status(404)
          .json({ success: false, message: "Exercício não encontrado" });
      }
      await exercicio.destroy();
      return res
        .status(200)
        .json({ success: true, message: "Exercício removido" });
    } catch (e) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Erro ao remover exercício",
          error: e.message,
        });
    }
  }
}

export default new ExercicioController();
