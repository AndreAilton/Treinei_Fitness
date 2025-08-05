import multer from "multer";
import multerConfig from "../config/multerconfig.js";
import file from "../models/Files.js";

import path, { extname, resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verificarDiretorioVazio(diretorio) {
  // Lê o conteúdo do diretório
  fs.readdir(diretorio, (err, arquivos) => {
    if (err) {
      console.log("Erro ao ler diretório:", err);
      return;
    }

    // Verifica se o diretório está vazio
    if (arquivos.length === 0) {
      return true;
    } else {
      return false;
    }
  });
}

class FileController {
  store(req, res) {
    const upload = multer(multerConfig).single("file");
    return upload(req, res, async (error) => {
      if (error) {
        return res.status(200).json({
          errors: [error.code],
        });
      }

      try {
        const { originalname, filename } = req.file;
        const category = req.body.Category;
        const id_treinador = req.treinadorId;

        // Garante que as pastas uploads e videos existem
        const uploadsDir = process.env.UPLOADS_PATH || resolve(__dirname, "..", "..", "uploads");
        const videosDir = resolve(uploadsDir, "videos");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir);
        }
        if (!fs.existsSync(videosDir)) {
          fs.mkdirSync(videosDir);
        }

        const File = await file.create({
          originalname,
          filename,
          id_treinador,
          category,
        });

        if (req.body.Category) {
          const userDir = resolve(
            videosDir,
            `${req.treinadorId}`,
            "nocategory",
            filename
          );
          const categoryDir = resolve(
            videosDir,
            `${id_treinador}`,
            `${req.body.Category}`
          );

          if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir, { recursive: true });
          }
          const newPath = resolve(categoryDir, filename);
          fs.renameSync(userDir, newPath);
        }

        return res.json(File);
      } catch (e) {
        return res.status(400).json({
          errors: ["Usuario Invalido"],
        });
      }
    });
  }
  async storeWithoutMulter(req, res) {
    try {
      const { originalname, filename, category } = req.body;

      return res.json(File);
    } catch (e) {
      return res.status(400).json({
        errors: ["Usuario Invalido"],
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const File = await file.findByPk(id);

      if (!File) {
        return res.status(404).json({
          errors: ["Foto nao encontrada"],
        });
      }

      const BackupDir = resolve(
        __dirname,
        "..",
        "..",
        "uploads",
        "videos",
        `${req.userId}`,
        "Backup"
      );
      const categoryDir = resolve(
        __dirname,
        "..",
        "..",
        "uploads",
        "videos",
        `${req.userId}`,
        `${File.category}`
      );
      const FilePath = resolve(categoryDir, File.filename);

      if (!fs.existsSync(BackupDir)) {
        fs.mkdirSync(BackupDir, { recursive: true });
      }

      fs.renameSync(FilePath, resolve(BackupDir, File.filename));
      if (verificarDiretorioVazio(categoryDir)) {
        fs.rmdirSync(categoryDir);
      }

      File.status = false;
      File.category = "Backup";
      await File.save();
      return res
        .status(200)
        .json({ sucess: true, message: "Foto deletada com sucesso" });
    } catch (e) {
      return res.status(400).json({
        errors: e,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const File = await file.findByPk(id);

      if (!File) {
        return res.status(404).json({
          errors: ["Foto nao encontrada"],
        });
      }
      if (req.body.category === File.category) {
        File.update(req.body);
        return res
          .status(200)
          .json({ sucess: true, message: "Foto Alterada com sucesso" });
      }
      const oldcategorydir = resolve(
        __dirname,
        "..",
        "..",
        "uploads",
        "videos",
        `${req.userId}`,
        `${File.category}`
      );
      const oldFilePath = resolve(oldcategorydir, File.filename);

      File.update(req.body);

      const newcategoryDir = resolve(
        __dirname,
        "..",
        "..",
        "uploads",
        "videos",
        `${req.userId}`,
        `${File.category}`
      );
      const newFilePath = resolve(newcategoryDir, File.filename);

      if (!fs.existsSync(newcategoryDir)) {
        fs.mkdirSync(newcategoryDir, { recursive: true });
      }

      fs.renameSync(oldFilePath, newFilePath);

      if (verificarDiretorioVazio(oldcategorydir)) {
        fs.rmdirSync(oldcategorydir);
      }

      return res
        .status(200)
        .json({ sucess: true, message: "Foto Alterada com sucesso" });
    } catch (e) {
      return res.status(400).json({ error: "Foto Nao Encontrada" });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const File = await file.findByPk(id);
      if (req.userId !== File.dataValues.id_treinador) {
        return res.status(400).json({
          errors: ["Foto nao encontrada"],
        });
      }

      return res.status(200).json(File);
    } catch (e) {
      return res.status(400).json({
        errors: "Imagem não encontrada",
      });
    }
  }
}

export default new FileController();
