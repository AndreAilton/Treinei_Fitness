// src/routes/userRoutes.js
import express from 'express';
import LoginRequire from '../middlewares/TokenRequire.js';
import UserController from '../controllers/UsuarioController.js';  


const router = express.Router();

router.post('/', UserController.store);
router.get('/',LoginRequire, UserController.show);
router.get('/:id',LoginRequire, UserController.show);
router.put('/', LoginRequire, UserController.update);
router.delete('/',LoginRequire, UserController.destroy);  

export default router;