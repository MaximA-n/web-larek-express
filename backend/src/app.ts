import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import productRouter from './routes/product';
import orderRouter from './routes/order';
import { NotFoundError } from './errors/NotFoundError';
import { errorHandler } from './middlewares/error-handler';
import { CelebrateError, isCelebrateError } from 'celebrate';
import { requestLogger, errorLogger } from './middlewares/logger';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import uploadRouter from './routes/upload';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

app.use(errorLogger);

app.use((err: CelebrateError | Error, req: Request, res: Response, next: NextFunction) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body')
      || err.details.get('params')
      || err.details.get('query');
    return res.status(400).json({
      message: errorBody?.message || 'Ошибка валидации',
    });
  }
  next(err);
});

app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/weblarek')
  .then(() => {
    console.log('MongoDB подключена');
    app.listen(3000, () => {
      console.log('Сервер запущен на 3000');
    });
  })
  .catch((err: Error) => {
    console.error('Ошибка подключения к MongoDB:', err.message);
  });

export default app;
