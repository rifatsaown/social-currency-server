import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Request body being validated:', req.body);

      // Parse the request body directly (instead of wrapping in a 'body' object)
      await schema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validateRequest;
