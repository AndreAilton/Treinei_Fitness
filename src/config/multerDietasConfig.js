import multer from "multer";
import path, { extname, resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new multer.MulterError("Arquivo precisa ser um PDF."));
    }
    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsDir =
        process.env.UPLOADS_PATH || resolve(__dirname, "..", "..", "uploads");
      const dietasDir = resolve(uploadsDir, "dietas");
      const treinadorDir = resolve(dietasDir, `${req.treinadorId}`);
      const tempDir = resolve(treinadorDir, "nocategory");

      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
      if (!fs.existsSync(dietasDir)) fs.mkdirSync(dietasDir);
      if (!fs.existsSync(treinadorDir)) fs.mkdirSync(treinadorDir);
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`);
    },
  }),
};
