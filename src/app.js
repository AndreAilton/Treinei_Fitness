import express from "express";
import dotenv from "dotenv";
import path from "path";

import cors from "cors";
import router from "./routes/index.js"; 
import './database/index.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileURLToPath } from 'url';



class app {
    constructor() {
        this.app = express();
        this.app.use(cors());
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(express.static(path.resolve(__dirname, "..", "uploads")));

}

    routes() {
        // this.app.get("/", (req, res) => res.json("Bem Vindo a Api"));
        // this.app.use("/users", UserRoutes);
        // this.app.use("/token", TokenRoutes);
        // this.app.use("/files", FileRoutes);
        // this.app.use("/tarefas", TarefasRoutes);
        // this.app.use("/admin", AdminRoutes);
        // this.app.use("*", (req, res) => res.status(404).json({ error: "Pagina Não Encontada" }));
        this.app.use(router); // Prefixo global para as rotas

    }
}

export default new app().app;