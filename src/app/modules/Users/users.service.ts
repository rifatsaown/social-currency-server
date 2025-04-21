import CustomError from '../../errors/CusromError';
import { IUser } from './users.interface';
import Users from './users.model';

// generate access and refresh token
const generateAccessToken = async (userID: string) => {
  try {
    const user = await Users.findById(userID);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    const accessToken = user.generateAccessToken();
    
    await user?.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    if (error instanceof Error) {
      throw new CustomError(error.message, 500);
    } else {
      throw new CustomError('Something went wrong while Generating Token', 500);
    }
  }
};

const getUsers = async () => {
  const result: IUser[] = await Users.find({});
  return result;
};

const createUser = async (userData: IUser) => {
  const user = await Users.create(userData);
  //generate access and refresh token
  const { accessToken } = await generateAccessToken(
    user._id.toString(),
  );

  //remove the password from the response
  const result = {
    ...user.toJSON(),
    accessToken,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (result as any)?.password;
  return result;
};

const userEligibilityRequest = async (userData: IUser) => {
  const email = userData.email;
  const user = await Users.findOne({ email });
  if (!user) {
    const newUser = await Users.create(userData);

    const result = {
      ...newUser.toJSON(),
    };
    return {
      message: 'User created successfully',
      data: result,
    };
  }

  return { message: 'User already exists', data: user };
};

export const userServices = {
  getUsers,
  createUser,
  generateAccessToken,
  userEligibilityRequest,
};
