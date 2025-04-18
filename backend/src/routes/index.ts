import express, { Request, Response } from 'express';
import {
  getUserStatsController,
  loginController,
  saveToDatabaseController,
} from '../controllers/userController';
import {
  getTopEngagedUsersController,
  getGeneralMetricsController,
  getFilteredStatsController,
} from '../controllers/adminController';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/api', saveToDatabaseController);

router.post('/api/login', loginController);

router.get('/api/user/stats', authenticateToken, getUserStatsController);

// ROTAS ADMIN
router.get('/api/admin/metrics', authenticateToken, isAdmin, getGeneralMetricsController);

router.get('/api/admin/ranking', authenticateToken, isAdmin, getTopEngagedUsersController);

router.get('/api/admin/stats', authenticateToken, isAdmin, getFilteredStatsController);

export { router as routes };
