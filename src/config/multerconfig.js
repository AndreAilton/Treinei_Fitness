import multer from "multer";
import path, { extname, resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new multer.MulterError(
          "Arquivo precisa ser um vídeo MP4, MOV, AVI ou MKV."
        )
      );
    }
    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsDir = process.env.UPLOADS_PATH || resolve(__dirname, "..", "..", "uploads");
      const videosDir = resolve(uploadsDir, "videos");
      const userDir = resolve(videosDir, `${req.userId}`);
      
      // Pega categoria do body (fallback: "nocategory")
      const categoria = req.body?.Categoria || "nocategory";

      const categoryDir = resolve(userDir, categoria);

      // Cria as pastas, se necessário
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
      if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir);
      if (!fs.existsSync(userDir)) fs.mkdirSync(userDir);
      if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir);

      // Define a pasta de destino como a pasta da categoria
      cb(null, categoryDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`);
    },
  }),
};
