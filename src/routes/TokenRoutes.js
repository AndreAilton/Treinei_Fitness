import { Router } from "express";
import Token from "../controllers/Usuario/TokenUsuarioController.js";
import TokenTreinador from "../controllers/Treinador/TokenTreinadorController.js";

const router = new Router();

// Token para usuário comum
router.post("/", Token.store);

// Token para treinador
router.post("/treinador", TokenTreinador.store);

export default router;
