import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Внутренняя ошибка сервера' : err.message;

    res.status(statusCode).json({ message });
};
