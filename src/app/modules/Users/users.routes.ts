import express, { Router } from 'express';
import authMiddleware from '../../middleware/authMiddleware';
import validateRequest from '../../middleware/validateRequest';
import { userController } from './users.controller';
import { validateUser } from './users.validation';

const router: Router = express.Router();

router.get('/', userController.getAllusers);
router.post(
  '/register',
  validateRequest(validateUser.userValidationSchema), // validate user request body using zod schema
  userController.createUser,
);

router.post('/eligibility-request', userController.userEligibilityRequest);

// New routes for eligibility check management
router.get('/eligibility-checks', userController.getAllEligibilityChecks);
router.post('/eligibility-process', userController.processEligibilityCheck);

// New routes for user management
router.post('/update-status', userController.updateUserStatus);
router.delete('/:id', userController.deleteUser);

// Route to get all participants (regular users)
router.get('/participants', userController.getAllParticipants);

// User campaign routes
router.get('/campaigns/:id', userController.getUserCampaigns);

// Coin balance routes
router.post('/update-coin-balance', userController.updateCoinBalance);

// User dashboard routes
router.get('/dashboard', authMiddleware, userController.getUserDashboardData);

router.get('/:email', userController.getUserByEmail);

// New routes for dashboard statistics and activity logging
router.get('/dashboard/stats', userController.getDashboardStats);
router.post('/activity/log', userController.logUserActivity);

export const usersRoutes = router;
