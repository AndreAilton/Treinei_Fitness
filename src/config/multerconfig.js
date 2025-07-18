import multer from 'multer';
import path, { extname, resolve } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aleatorio = () => Math.floor(Math.random() * 10000 + 10000);

export default {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new multer.MulterError('Arquivo precisa ser PNG ou JPG.'));
    }

    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const userDir = resolve(__dirname, '..', '..', 'uploads', 'images', `${req.userId}`)
      const nocategoryDir = resolve(__dirname, '..', '..', 'uploads', 'images', `${req.userId}`, 'nocategory');
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