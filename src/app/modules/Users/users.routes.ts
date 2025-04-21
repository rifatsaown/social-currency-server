import express, { Router } from 'express';
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

export const usersRoutes = router;
