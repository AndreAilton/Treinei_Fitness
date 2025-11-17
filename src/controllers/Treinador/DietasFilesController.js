import multer from "multer";
import multerDietasConfig from "../../config/multerDietasConfig.js";
import DietaFile from "../../models/Dietas_Files.js";
import path from "path";
import fs from "fs";

const upload = multer(multerDietasConfig).single("file");

class DietasFilesController {
  // 📌 Criar nova dieta (NÃO REMOVE mais nenhum arquivo anterior)
  store(req, res) {
    return upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ errors: [error.code] });
      }

      try {
        const { originalname, filename, mimetype } = req.file;
        const { descricao } = req.body;
        const id_treinador = req.treinadorId;

        // Pastas
        const uploadsDir =
          process.env.UPLOADS_PATH ||
          path.resolve(__dirname, "..", "..", "uploads");
        const dietasDir = path.resolve(uploadsDir, "dietas");
        const treinadorDir = path.resolve(dietasDir, `${id_treinador}`);

        // Cria pastas
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
        if (!fs.existsSync(dietasDir)) fs.mkdirSync(dietasDir);
        if (!fs.existsSync(treinadorDir)) fs.mkdirSync(treinadorDir);

        // 🔥 NÃO REMOVE MAIS ARQUIVOS ANTIGOS

        // Criar registro no banco
        const created = await DietaFile.create({
          originalname,
          filename,
          descricao,
          mime_type: mimetype,
          id_treinador,
          status: true,
        });

        // Mover arquivo temp → destino final
        try {
          const tempPath = req.file.path;
          const destPath = path.resolve(treinadorDir, filename);

          if (fs.existsSync(tempPath)) fs.renameSync(tempPath, destPath);
        } catch (err) {
          console.log("Erro ao mover arquivo:", err);
        }

        return res.status(201).json(created.toJSON());
      } catch (e) {
        return res.status(400).json({ errors: [e.message] });
      }
    });
  }

  // 📌 Mostrar um arquivo
  async show(req, res) {
    try {
      const { id } = req.params;
      const file = await DietaFile.findByPk(id);

      if (!file) return res.status(404).json({ errors: ["Arquivo não encontrado"] });
      if (req.treinadorId !== file.id_treinador)
        return res.status(403).json({ errors: ["Acesso negado"] });

      return res.status(200).json(file.toJSON());
    } catch (e) {
      return res.status(400).json({ errors: [e.message] });
    }
  }

  // 📌 Listar dietas do treinador
  async index(req, res) {
    try {
      const files = await DietaFile.findAll({
        where: { id_treinador: req.treinadorId },
        attributes: [
          "id",
          "originalname",
          "filename",
          "descricao",
          "mime_type",
          "id_treinador",
          "status",
          "created_at",
          "updated_at",
        ],
      });

      return res.status(200).json({ success: true, files });
    } catch (e) {
      return res.status(400).json({ errors: [e.message] });
    }
  }

  // 📌 Atualizar dieta (arquivo é substituído, MAS a antiga não é deletada)
  update(req, res) {
    return upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ errors: [error.code] });
      }

      try {
        const { id } = req.params;
        const file = await DietaFile.findByPk(id);

        if (!file)
          return res.status(404).json({ errors: ["Arquivo não encontrado"] });

        const uploadsDir =
          process.env.UPLOADS_PATH ||
          path.resolve(__dirname, "..", "..", "uploads");
        const dietasDir = path.resolve(uploadsDir, "dietas");
        const treinadorDir = path.resolve(dietasDir, `${file.id_treinador}`);

        // Atualização com novo arquivo
        if (req.file) {
          const { originalname, filename, mimetype } = req.file;

          // NÃO REMOVE mais o antigo — só sobrescreve dados
          const tempPath = req.file.path;
          const destPath = path.resolve(treinadorDir, filename);

          if (!fs.existsSync(treinadorDir)) {
            fs.mkdirSync(treinadorDir, { recursive: true });
          }

          if (fs.existsSync(tempPath)) fs.renameSync(tempPath, destPath);

          await file.update({
            originalname,
            filename,
            mime_type: mimetype,
            ...(req.body.descricao && { descricao: req.body.descricao }),
          });
        } else {
          await file.update({
            ...(req.body.descricao && { descricao: req.body.descricao }),
          });
        }

        return res.status(200).json({
          success: true,
          file: file.toJSON(),
        });
      } catch (e) {
        return res.status(400).json({ errors: [e.message] });
      }
    });
  }

  // 📌 "Excluir" dieta → move para backup e status = false
  async delete(req, res) {
  try {
    const { id } = req.params;
    const file = await DietaFile.findByPk(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        errors: ["Arquivo não encontrado"],
      });
    }

    // Caminhos
    const uploadsDir = process.env.UPLOADS_PATH || path.resolve("uploads");
    const dietasDir = path.resolve(uploadsDir, "dietas");
    const treinadorDir = path.resolve(dietasDir, `${file.id_treinador}`);
    const filePath = path.resolve(treinadorDir, file.filename);

    // Remove arquivo físico
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove definitivamente do banco
    await file.destroy();

    return res.status(200).json({
      success: true,
      message: "Arquivo excluído do sistema e removido do banco de dados",
    });

  } catch (e) {
    return res.status(400).json({
      success: false,
      errors: [e.message],
    });
  }
}

}

export default new DietasFilesController();
