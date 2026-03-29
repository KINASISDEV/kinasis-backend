import { Router } from 'express';
import { getCatalog } from '../controllers/catalogsController.js';

const router = Router();

router.get('/', getCatalog);

export default router;
