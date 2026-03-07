
import { Router } from 'express';
import { changePassword, getProfile, updateProfile } from '../controllers/user-controller';
import { authenticateToken } from '../middlewares/auth'


const router = Router();

router.get('/me', authenticateToken, getProfile);
router.patch('/profile', authenticateToken, updateProfile);
router.patch('/password', authenticateToken, changePassword)

export default router;