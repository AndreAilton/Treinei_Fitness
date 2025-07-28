import express from "express";
import LoginRequire from "../middlewares/TokenRequire.js";
import UsuariosTreinoController from "../controllers/UsuariosTreinoController.js";

const router = express.Router();

router.post("/", LoginRequire, UsuariosTreinoController.store);
router.get("/", LoginRequire, UsuariosTreinoController.index);
router.get("/:id", LoginRequire, UsuariosTreinoController.show);
router.put("/:id", LoginRequire, UsuariosTreinoController.update);
router.delete("/:id", LoginRequire, UsuariosTreinoController.destroy);

export default router;
