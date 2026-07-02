import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rootRouter from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import './config/passport.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1', rootRouter);
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Fotobook Backend API is running!',
    status: 'Active',
  });
});

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});

export default app;
