import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

const notFound = (req: Request, res: Response) => {
  res.status(404).send(new ApiResponse(404, null, 'Resource not found'));
};

export default notFound;
