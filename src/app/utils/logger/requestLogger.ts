import { Request, Response, NextFunction } from 'express';
import logger from '.';

//Log the request
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request: ${req.method} ${req.path} ${req.ip}`);
  next();
};

export default requestLogger;
