import express from 'express';
import { db } from '../config/firebase';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    // Get all users from Firestore
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      return res.status(200).json({ users: [] });
    }

    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get participants only (admin only)
router.get(
  '/participants',
  authenticateUser,
  requireAdmin,
  async (req, res) => {
    try {
      // Get participants from Firestore
      const participantsSnapshot = await db
        .collection('users')
        .where('role', '==', 'participant')
        .get();

      if (participantsSnapshot.empty) {
        return res.status(200).json({ participants: [] });
      }

      const participants = participantsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ participants });
    } catch (error) {
      console.error('Error fetching participants:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
);

// Get a single user by ID (admin or self)
router.get('/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user is requesting their own data or if they're an admin
    if (req.user?.uid !== userId && req.user?.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Forbidden: You can only access your own data' });
    }

    // Get user from Firestore
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res
      .status(200)
      .json({ user: { id: userDoc.id, ...userDoc.data() } });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
