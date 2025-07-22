import express from "express";
import LoginRequire from "../middlewares/TokenRequire.js";
import TreinoDiaController from "../controllers/TreinoDiaController.js";

const router = express.Router();

router.post("/", LoginRequire, TreinoDiaController.store);
router.get("/", LoginRequire, TreinoDiaController.index);
router.get("/:id", LoginRequire, TreinoDiaController.show);
router.put("/:id", LoginRequire, TreinoDiaController.update);
router.delete("/:id", LoginRequire, TreinoDiaController.destroy);

export default router;
