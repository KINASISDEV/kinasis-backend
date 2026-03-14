import { Router } from 'express';
import { getMembers } from '../controllers/MembersController.js';

const router = Router();

router.get('/', getMembers);

export default router;
