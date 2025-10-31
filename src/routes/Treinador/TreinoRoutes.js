import express from "express";
import LoginRequire from "../../middlewares/TokenRequire.js";
import TreinoController from "../../controllers/Treinador/TreinoController.js";

const router = express.Router();

router.post("/", LoginRequire, TreinoController.store);
router.get("/", LoginRequire, TreinoController.index);
router.get("/:id", LoginRequire, TreinoController.show);
router.put("/:id", LoginRequire, TreinoController.update);
router.delete("/:id", LoginRequire, TreinoController.destroy);

export default router;
