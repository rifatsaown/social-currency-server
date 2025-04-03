import express from 'express';
import logger from '../app/utils/logger';
import { auth, db } from '../config/firebase';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Verify a user's authentication token
router.get('/verify-token', authenticateUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get user data including role and active status
    const userRecord = await auth.getUser(req.user.uid);

    // Get user metadata from Firestore
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    return res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      role: userData?.role || 'participant',
      isActive: userData?.isActive || false,
    });
  } catch (error) {
    logger.error('Error verifying user token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Generate invitation link (admin only)
router.post('/invite', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { email, displayName } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Generate a random password for initial account creation
    const randomPassword = Math.random().toString(36).slice(-8);

    try {
      // Create a new user with Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password: randomPassword,
        displayName: displayName || email.split('@')[0],
        emailVerified: false,
      });

      // Generate password reset link to allow the user to set their password
      const actionCodeSettings = {
        url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?email=${email}`,
        handleCodeInApp: false,
      };

      // Generate the invitation link
      const inviteLink = await auth.generatePasswordResetLink(
        email,
        actionCodeSettings,
      );

      // Store user in Firestore with participant role
      await db
        .collection('users')
        .doc(userRecord.uid)
        .set({
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: displayName || email.split('@')[0],
          role: 'participant',
          isActive: true,
          createdAt: new Date().toISOString(),
          invitedBy: req?.user?.uid,
        });

      return res.status(200).json({
        message: 'Invitation created successfully',
        inviteLink,
        userId: userRecord.uid,
      });
    } catch (error) {
      logger.error('Error creating user:', error);
      return res.status(400).json({ message: 'Error creating user', error });
    }
  } catch (error) {
    logger.error('Error sending invitation:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Set/update user role (admin only)
router.post('/set-role', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: 'User ID and role are required' });
    }

    if (role !== 'admin' && role !== 'participant') {
      return res
        .status(400)
        .json({ message: 'Invalid role. Must be admin or participant' });
    }

    // Update custom claims with the role
    await auth.setCustomUserClaims(userId, { role });

    // Update user document in Firestore
    await db.collection('users').doc(userId).update({
      role,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user?.uid,
    });

    return res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    logger.error('Error setting user role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Activate/deactivate user (admin only)
router.post(
  '/set-active-status',
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId, isActive } = req.body;

      if (!userId || isActive === undefined) {
        return res
          .status(400)
          .json({ message: 'User ID and isActive status are required' });
      }

      // Update user in Firebase Auth
      if (isActive) {
        await auth.updateUser(userId, { disabled: false });
      } else {
        await auth.updateUser(userId, { disabled: true });
      }

      // Update user document in Firestore
      await db.collection('users').doc(userId).update({
        isActive,
        updatedAt: new Date().toISOString(),
        updatedBy: req.user?.uid,
      });

      return res
        .status(200)
        .json({ message: 'User status updated successfully' });
    } catch (error) {
      logger.error('Error setting user active status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
);

export default router;
