import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Kích hoạt biến môi trường
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Gắn bộ lọc middleware
app.use(cors());
app.use(express.json());

// Kiểm tra endpoint mặc định
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hệ thống Fotobook API!!!!??>",
    status: "Active"
  });
});

app.listen(PORT, () => {
  console.log(`Server ES6 đang chạy tại: http://localhost:${PORT}`);
});

export default app;