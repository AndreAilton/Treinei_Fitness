// src/routes/TreinadorRoutes.js
import express from "express";
import LoginRequire from "../../middlewares/TokenRequire.js";
import TreinadorController from "../../controllers/Treinador/TreinadorController.js";
import PasswordController from '../../controllers/Treinador/PasswordController.js';
const router = express.Router();

router.post("/", TreinadorController.store);
router.get("/all", TreinadorController.index);
router.get("/", LoginRequire, TreinadorController.show);
router.get("/:id", LoginRequire, TreinadorController.show);
router.put("/", LoginRequire, TreinadorController.update);
router.delete("/", LoginRequire, TreinadorController.destroy);

router.post('/forgot-password', PasswordController.forgotPassword);
router.post('/reset-password/', PasswordController.resetPassword);

export default router;
