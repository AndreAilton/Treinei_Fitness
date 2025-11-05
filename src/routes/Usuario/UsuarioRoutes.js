// src/routes/userRoutes.js
import express from "express";
import LoginRequire from "../../middlewares/TokenRequire.js";
import UserController from "../../controllers/Usuario/UsuarioController.js";
import ApiKeyRequire from "../../middlewares/ApiKeyRequire.js";

const router = express.Router();

router.post("/", UserController.store);
router.get("/", LoginRequire, UserController.show);
router.get("/:telefone", ApiKeyRequire, UserController.show);
router.put("/", LoginRequire, UserController.update);
router.delete("/", LoginRequire, UserController.destroy);

export default router;
