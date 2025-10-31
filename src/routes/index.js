import { Router } from "express";

import UserRoutes from "./Usuario/UsuarioRoutes.js";
import TreinadorRoutes from "./Treinador/TreinadorRoutes.js";
import TokenRoutes from "./TokenRoutes.js";
import ExercicioRoutes from "./Treinador/ExercicioRoutes.js";
import TreinoRoutes from "./Treinador/TreinoRoutes.js";
import TreinoDiaRoutes from "./Treinador/TreinoDiaRoutes.js";
import UsuarioTreino from "./Usuario/UsuariosTreinoRoutes.js";
import FileRoutes from "./FilesRoutes.js";

const router = Router();

// Rota de boas-vindas
router.get("/", (req, res) => res.json("Bem Vindo a Api"));

// Definição das rotas
router.use("/usuarios", UserRoutes);
router.use("/treinadores", TreinadorRoutes);
router.use("/token", TokenRoutes);
router.use("/exercicios", ExercicioRoutes);
router.use("/treinos", TreinoRoutes);
router.use("/treinos-dias", TreinoDiaRoutes);
router.use("/usuario-treino", UsuarioTreino);
router.use("/files", FileRoutes);

// Rota para 404
router.use("*", (req, res) =>
  res.status(404).json({ error: "Página Não Encontrada" })
);

export default router;
