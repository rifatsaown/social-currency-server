import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

// Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  // Initialize Firebase Admin with environment variables
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// Export the admin instance
export const auth = admin.auth();
export const db = admin.firestore();

export default admin;
