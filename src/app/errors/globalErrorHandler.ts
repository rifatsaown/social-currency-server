/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { IErrorSources } from '../interfaces/error';
import CustomError from './CusromError';
import handleCastError from './handleCastError';
import handleDuplicateError from './handleDuplicateError';
import handleValidationError from './handlevadiationErrors';
import handleZodError from './handleZodError';

// eslint-disable-next-line
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  if (config.nodeEnv === 'development') console.log(err); // Use logger.error for consistency

  //setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: IErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  /* handling different types of errors and setting the response */

  // zod error
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  //validation error
  if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  // cast error
  else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  // duplicate error
  else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  // custom error
  else if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  //ultimate return
  return res.status(statusCode).json({
    statusCode,
    data: null,
    success: false,
    message: message || 'Something went wrong!',
    errorSources,
    stack: config.nodeEnv === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
