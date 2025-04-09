import express from 'express';
import * as firebaseUserController from '../../controllers/firebaseUserController';
import {
  authenticateUser,
  requireAdmin,
} from '../../middleware/authMiddleware';

const router = express.Router();

// Create a new user (requires authentication)
router.post('/', authenticateUser, firebaseUserController.createUser);

// Get all users (admin only)
router.get(
  '/',
  authenticateUser,
  requireAdmin,
  firebaseUserController.getAllUsers,
);

// Get all participants (admin only)
router.get(
  '/participants',
  authenticateUser,
  requireAdmin,
  firebaseUserController.getAllParticipants,
);

// Get a single user by ID (authenticated user can only retrieve their own data, admin can retrieve any)
router.get(
  '/:uid',
  authenticateUser,
  async (req, res, next) => {
    // Check if the requesting user is admin or requesting their own data
    if (req.user?.role === 'admin' || req.user?.uid === req.params.uid) {
      return next();
    }

    // Unauthorized access
    return res.status(403).json({
      success: false,
      message: 'Forbidden: You can only access your own data',
    });
  },
  firebaseUserController.getUserByUid,
);

// Update a user (authenticated user can only update their own data, admin can update any)
router.put(
  '/:uid',
  authenticateUser,
  async (req, res, next) => {
    // Check if the requesting user is admin or updating their own data
    if (req.user?.role === 'admin' || req.user?.uid === req.params.uid) {
      return next();
    }

    // Unauthorized access
    return res.status(403).json({
      success: false,
      message: 'Forbidden: You can only update your own data',
    });
  },
  firebaseUserController.updateUser,
);

// Delete a user (admin only)
router.delete(
  '/:uid',
  authenticateUser,
  requireAdmin,
  firebaseUserController.deleteUser,
);

export default router;
