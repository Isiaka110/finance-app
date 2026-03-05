import express from 'express';
import { getNotifications, markRead } from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getNotifications);
router.put('/read', auth, markRead);

export default router;
