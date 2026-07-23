import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import cookieParser from 'cookie-parser';
import rootRouter from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import './config/passport.js';
import { logInfo } from './utils/logging.js';
import config from './config/env.js';
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.2.43:5173',
  'https://rosy-fotobook.vercel.app',
  'http://localhost:3002',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', rootRouter);
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Fotobook Backend API is running!',
    status: 'Active',
  });
});

app.use(errorMiddleware);
app.listen(config.app.port, () => {
  logInfo('Server', `Server is running on port ${config.app.port}`);
});

export default app;
