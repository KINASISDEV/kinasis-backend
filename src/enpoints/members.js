import { Router } from 'express';
import { getMembers, getImageMemberS3 } from '../controllers/membersController.js';

const router = Router();

router.get('/', getMembers);
router.get('/getImageMemberS3', getImageMemberS3);

export default router;
