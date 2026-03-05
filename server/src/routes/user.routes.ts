
import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user-controller';
import { authenticateToken } from '../middlewares/auth'


const router = Router();

router.get('/me', authenticateToken, getProfile);
router.patch('/profile', authenticateToken, updateProfile);

export default router;