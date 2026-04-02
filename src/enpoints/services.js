import { Router } from 'express';
import { getAllServices } from '../controllers/servicesController.js';

const router = Router();

router.get('/', getAllServices);

export default router;
