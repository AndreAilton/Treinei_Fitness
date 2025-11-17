import express from "express";
import LoginRequire from "../../middlewares/TokenRequire.js";
import DietasFilesController from "../../controllers/Treinador/DietasFilesController.js";

const router = express.Router();

router.post("/", LoginRequire, DietasFilesController.store);
router.get("/", LoginRequire, DietasFilesController.index);
router.get("/:id", LoginRequire, DietasFilesController.show);
router.put("/:id", LoginRequire, DietasFilesController.update);
router.delete("/:id", LoginRequire, DietasFilesController.delete);

export default router;
