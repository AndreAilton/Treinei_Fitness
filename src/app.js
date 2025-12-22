import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";
import path from "path";
import "./database/index.js";
dotenv.config();

const uploadPath = path.resolve(process.env.UPLOADS_PATH, "videos");
const dietasPath = path.resolve(process.env.UPLOADS_PATH, "dietas");
class app {
  constructor() {
    this.app = express();
    this.app.use(
      cors()
    );
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.urlencoded({ extended: false, limit: '100mb' }));
    this.app.use(express.json({ limit: '100mb' }));
    this.app.use("/Videos", express.static(uploadPath));
    this.app.use("/Dietas", express.static(dietasPath));
  }

  routes() {
    this.app.use(router);
  }
}

export default new app().app;
