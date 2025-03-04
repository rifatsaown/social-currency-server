import express, { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { createUser, getAllusers } from './users.controller';
import { validateUser } from './users.validation';

const router: Router = express.Router();

router.get('/', getAllusers);
router.post(
  '/register',
  validateRequest(validateUser.userValidationSchema), // validate user request body using zod schema
  createUser,
);

export const usersRoutes = router;
