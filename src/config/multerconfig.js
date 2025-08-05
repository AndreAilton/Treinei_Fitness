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
      "video/quicktime", // mov
      "video/x-msvideo", // avi
      "video/x-matroska", // mkv
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
      const nocategoryDir = resolve(userDir, "nocategory");

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir);
      }
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
      }
      if (!fs.existsSync(nocategoryDir)) {
        fs.mkdirSync(nocategoryDir);
      }

      cb(null, nocategoryDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${aleatorio()}${extname(file.originalname)}`);
    },
  }),
};
