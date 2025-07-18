// src/routes/TreinadorRoutes.js
import express from "express";
import LoginRequire from "../middlewares/TokenRequire.js";
import TreinadorController from "../controllers/TreinadorController.js";

const router = express.Router();

router.post("/", TreinadorController.store);
router.get("/", LoginRequire, TreinadorController.show);
router.get("/:id", LoginRequire, TreinadorController.show);
router.put("/", LoginRequire, TreinadorController.update);
router.delete("/", LoginRequire, TreinadorController.destroy);

export default router;
