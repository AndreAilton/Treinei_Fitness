import express from "express";
import LoginRequire from "../../middlewares/TokenRequire.js";
import ExercicioController from "../../controllers/Treinador/ExercicioController.js";

const router = express.Router();

router.post("/", LoginRequire, ExercicioController.store);
router.get("/", LoginRequire, ExercicioController.index);
router.get("/:id", LoginRequire, ExercicioController.show);
router.put("/:id", LoginRequire, ExercicioController.update);
router.delete("/:id", LoginRequire, ExercicioController.destroy);

export default router;
