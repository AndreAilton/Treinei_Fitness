import { Router } from 'express';

import File from '../controllers/FilesController.js';
import LoginRequire from '../middlewares/TokenRequire.js';
const router = new Router();

router.post('/', LoginRequire, File.store);
router.delete('/:id', LoginRequire, File.delete);
router.put('/:id', LoginRequire, File.update);
router.get('/:id', LoginRequire, File.show);

export default router;