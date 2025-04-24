import express from 'express';
import { campaignRoutes } from '../modules/Campaigns/campaigns.routes';
import { usersRoutes } from '../modules/Users/users.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: usersRoutes,
  },
  {
    path: '/campaigns',
    route: campaignRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
