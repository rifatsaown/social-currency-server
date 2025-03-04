import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import path from 'path';
import globalErrorHandler from './app/errors/globalErrorHandler';
import routes from './app/routes';
import notFound from './app/middleware/notFound';
import requestLogger from './app/utils/logger/requestLogger';

const app: Application = express();

// cors
app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Log the request
app.use(requestLogger);

// Application routes
app.use('/', routes);

//Welcome route
app.get('/', async (req: Request, res: Response) => {
  res.render('welcome', { port: process.env.PORT });
});

//Health check route
app.get('/health', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running' });
});



//Not found route
app.use(notFound);

// Error handling
app.use(globalErrorHandler);

export default app;
