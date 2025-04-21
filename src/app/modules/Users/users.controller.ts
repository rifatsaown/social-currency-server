import { ApiResponse } from '../../utils/ApiResponse';
import catchAsync from '../../utils/catchAsync';
import { userServices } from './users.service';

const getAllusers = catchAsync(async (req, res) => {
  const result = await userServices.getUsers();
  res.status(200).json(new ApiResponse(200, result));
});

const createUser = catchAsync(async (req, res) => {
  const data = req.body;

  const createdUser = await userServices.createUser(data);

  res.status(200).json(new ApiResponse(200 , createdUser));
});

const userEligibilityRequest = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await userServices.userEligibilityRequest(data);
  
  res.status(200).send(
    new ApiResponse(200, result.data ? result.data : null, result.message ? result.message : 'User not found' )
  );
}
);


export const userController = {
  getAllusers,
  createUser,
  userEligibilityRequest,
};
