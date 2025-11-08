import multer from "multer";
import multerDietasConfig from "../../config/multerDietasConfig.js";
import DietaFile from "../../models/Dietas_Files.js";
import path from "path";
import fs from "fs";

const upload = multer(multerDietasConfig).single("file");

class DietasFilesController {
  store(req, res) {
    return upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ errors: [error.code] });
      }

      try {
        const { originalname, filename, mimetype } = req.file;
        const { id_usuario: id_usuario_raw, descricao } = req.body;
        const id_treinador = req.treinadorId;
        const id_usuario =
          id_usuario_raw !== undefined && id_usuario_raw !== null
            ? Number(id_usuario_raw)
            : null;

        const uploadsDir =
          process.env.UPLOADS_PATH ||
          path.resolve(__dirname, "..", "..", "uploads");
        const dietasDir = path.resolve(uploadsDir, "dietas");

        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
        if (!fs.existsSync(dietasDir)) fs.mkdirSync(dietasDir);

        // Antes de criar uma nova dieta para o mesmo usuário, apaga a anterior (se existir)
        if (id_usuario) {
          try {
            const anteriores = await DietaFile.findAll({
              where: { id_treinador, id_usuario, status: true },
            });
            for (const ant of anteriores) {
              try {
                const oldPath = path.resolve(
                  dietasDir,
                  `${ant.id_treinador}`,
                  `${ant.id_usuario}`,
                  ant.filename
                );
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
              } catch (fileErr) {
                console.log(
                  "Erro ao remover arquivo antigo de dieta:",
                  fileErr.message || fileErr
                );
              }
              try {
                await ant.destroy();
              } catch (dbErr) {
                console.log(
                  "Erro ao remover registro antigo de dieta:",
                  dbErr.message || dbErr
                );
              }
            }
          } catch (qErr) {
            console.log(
              "Erro ao buscar dietas anteriores:",
              qErr.message || qErr
            );
          }
        }

        const created = await DietaFile.create({
          originalname,
          filename,
          descricao,
          mime_type: mimetype,
          id_treinador,
          id_usuario,
        });

        // Move arquivo do diretório temporário (padrão do multerDietasConfig) para /uploads/dietas/<id_treinador>/<id_usuario>/
        try {
          const tempPath = path.resolve(
            uploadsDir,
            "dietas",
            `${id_treinador}`,
            "nocategory",
            filename
          );
          const destDir = path.resolve(
            dietasDir,
            `${id_treinador}`,
            `${id_usuario}`
          );
          if (!fs.existsSync(destDir))
            fs.mkdirSync(destDir, { recursive: true });
          const destPath = path.resolve(destDir, filename);
          if (fs.existsSync(tempPath)) {
            fs.renameSync(tempPath, destPath);

            // Tenta remover a pasta nocategory após mover o arquivo
            try {
              const nocategoryDir = path.resolve(
                dietasDir,
                `${id_treinador}`,
                "nocategory"
              );
              // Verifica se a pasta existe e está vazia antes de tentar remover
              if (fs.existsSync(nocategoryDir)) {
                const files = fs.readdirSync(nocategoryDir);
                if (files.length === 0) {
                  fs.rmdirSync(nocategoryDir);
                }
              }
            } catch (rmErr) {
              console.log(
                "Aviso: Não foi possível remover pasta nocategory:",
                rmErr.message || rmErr
              );
            }
          }
        } catch (moveErr) {
          // Não interrompe a criação do registro — apenas loga
          console.log(
            "Erro ao mover arquivo para pasta dietas:",
            moveErr.message || moveErr
          );
        }

        const jsonCreated = created.toJSON();
        // Garantir que id_usuario seja number na resposta
        if (
          jsonCreated.id_usuario !== undefined &&
          jsonCreated.id_usuario !== null
        ) {
          jsonCreated.id_usuario = Number(jsonCreated.id_usuario);
        }
        return res.status(201).json(jsonCreated);
      } catch (e) {
        return res.status(400).json({ errors: [e.message] });
      }
    });
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const file = await DietaFile.findByPk(id);
      if (!file)
        return res.status(404).json({ errors: ["Arquivo não encontrado"] });

      if (req.treinadorId !== file.id_treinador) {
        return res.status(403).json({ errors: ["Acesso negado"] });
      }

      const json = file.toJSON();
      if (json.id_usuario !== undefined && json.id_usuario !== null)
        json.id_usuario = Number(json.id_usuario);
      return res.status(200).json(json);
    } catch (e) {
      return res.status(400).json({ errors: [e.message] });
    }
  }

  async index(req, res) {
    try {
      const files = await DietaFile.findAll({
        where: { id_treinador: req.treinadorId },
      });
      const mapped = files.map((f) => {
        const j = f.toJSON();
        if (j.id_usuario !== undefined && j.id_usuario !== null)
          j.id_usuario = Number(j.id_usuario);
        return j;
      });
      return res.status(200).json({ success: true, files: mapped });
    } catch (e) {
      return res.status(400).json({ errors: [e.message] });
    }
  }

  async update(req, res) {
    return upload(req, res, async (error) => {
      if (error) {
        return res.status(400).json({ errors: [error.code] });
      }

      try {
        const { id } = req.params;
        const file = await DietaFile.findByPk(id);
        if (!file) {
          return res.status(404).json({ errors: ["Arquivo não encontrado"] });
        }

        const uploadsDir =
          process.env.UPLOADS_PATH ||
          path.resolve(__dirname, "..", "..", "uploads");
        const dietasDir = path.resolve(uploadsDir, "dietas");

        // Se recebeu novo arquivo
        if (req.file) {
          const { originalname, filename, mimetype } = req.file;
          const oldPath = path.resolve(
            dietasDir,
            `${file.id_treinador}`,
            `${file.id_usuario}`,
            file.filename
          );

          // Remove arquivo antigo
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }

          // Move novo arquivo para pasta correta
          const tempPath = path.resolve(
            dietasDir,
            `${file.id_treinador}`,
            "nocategory",
            filename
          );

          const newIdUsuario = req.body.id_usuario
            ? Number(req.body.id_usuario)
            : file.id_usuario;
          const destDir = path.resolve(
            dietasDir,
            `${file.id_treinador}`,
            `${newIdUsuario}`
          );

          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }

          const destPath = path.resolve(destDir, filename);
          if (fs.existsSync(tempPath)) {
            fs.renameSync(tempPath, destPath);

            // Tenta remover pasta nocategory se vazia
            try {
              const nocategoryDir = path.resolve(
                dietasDir,
                `${file.id_treinador}`,
                "nocategory"
              );
              if (fs.existsSync(nocategoryDir)) {
                const files = fs.readdirSync(nocategoryDir);
                if (files.length === 0) {
                  fs.rmdirSync(nocategoryDir);
                }
              }
            } catch (rmErr) {
              console.log(
                "Aviso: Não foi possível remover pasta nocategory:",
                rmErr.message || rmErr
              );
            }
          }

          // Atualiza registro com dados do novo arquivo
          await file.update({
            originalname,
            filename,
            mime_type: mimetype,
            ...(req.body.descricao && { descricao: req.body.descricao }),
            ...(req.body.id_usuario && {
              id_usuario: Number(req.body.id_usuario),
            }),
          });
        } else {
          // Se não recebeu arquivo, apenas atualiza metadados
          const newIdUsuario = req.body.id_usuario
            ? Number(req.body.id_usuario)
            : undefined;

          if (newIdUsuario && newIdUsuario !== file.id_usuario) {
            // Move arquivo para nova pasta de usuário
            const oldPath = path.resolve(
              dietasDir,
              `${file.id_treinador}`,
              `${file.id_usuario}`,
              file.filename
            );
            const newDir = path.resolve(
              dietasDir,
              `${file.id_treinador}`,
              `${newIdUsuario}`
            );
            if (!fs.existsSync(newDir)) {
              fs.mkdirSync(newDir, { recursive: true });
            }
            const newPath = path.resolve(newDir, file.filename);
            if (fs.existsSync(oldPath)) {
              fs.renameSync(oldPath, newPath);
            }
          }

          await file.update({
            ...(req.body.descricao && { descricao: req.body.descricao }),
            ...(newIdUsuario && { id_usuario: newIdUsuario }),
          });
        }

        const updatedFile = await DietaFile.findByPk(id);
        const json = updatedFile.toJSON();
        if (json.id_usuario !== undefined && json.id_usuario !== null) {
          json.id_usuario = Number(json.id_usuario);
        }

        return res.status(200).json({ success: true, file: json });
      } catch (e) {
        return res.status(400).json({ errors: [e.message] });
      }
    });
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const file = await DietaFile.findByPk(id);
      if (!file)
        return res.status(404).json({ errors: ["Arquivo não encontrado"] });

      const uploadsDir =
        process.env.UPLOADS_PATH ||
        path.resolve(__dirname, "..", "..", "uploads");
      const dietasDir = path.resolve(uploadsDir, "dietas");
      const userDir = path.resolve(
        dietasDir,
        `${file.id_treinador}`,
        `${file.id_usuario}`
      );
      const filePath = path.resolve(userDir, file.filename);
      const backupDir = path.resolve(
        dietasDir,
        `${file.id_treinador}`,
        `${file.id_usuario}`,
        "Backup"
      );

      if (!fs.existsSync(backupDir))
        fs.mkdirSync(backupDir, { recursive: true });
      if (fs.existsSync(filePath))
        fs.renameSync(filePath, path.resolve(backupDir, file.filename));

      file.status = false;
      file.descricao = "Backup";
      await file.save();

      return res.status(200).json({
        success: true,
        message: "Arquivo movido para Backup e marcado como inativo",
      });
    } catch (e) {
      return res.status(400).json({ errors: [e.message] });
    }
  }
}

export default new DietasFilesController();
