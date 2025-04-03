import express from 'express';
import authRoutes from '../../../src/routes/authRoutes';
import firebaseUserRoutes from '../../../src/routes/firebaseUserRoutes';
import userRoutes from '../../../src/routes/userRoutes';
import { usersRoutes } from '../modules/Users/users.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: usersRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/firebase-users',
    route: userRoutes,
  },
  {
    path: '/api/users',
    route: firebaseUserRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
