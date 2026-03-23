import { Router } from 'express';
import { getImageFromS3, exportAllImagesS3 } from '../services/aws.js';

const router = Router();

router.get('/allImages', exportAllImagesS3);
router.get('/getImageFromS3', getImageFromS3);

export default router;