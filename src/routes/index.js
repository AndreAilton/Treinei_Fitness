import { Router } from "express";

import UserRoutes from "./UsuarioRoutes.js";
import TreinadorRoutes from "./TreinadorRoutes.js";
import TokenRoutes from "./TokenRoutes.js";
const router = Router();

// Rota de boas-vindas
router.get("/", (req, res) => res.json("Bem Vindo a Api"));

// Definição das rotas
router.use("/usuarios", UserRoutes);
router.use("/treinadores", TreinadorRoutes);
router.use("/token", TokenRoutes);

// Rota para 404
router.use("*", (req, res) => res.status(404).json({ error: "Página Não Encontrada" }));

export default router;