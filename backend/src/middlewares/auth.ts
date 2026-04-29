import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../helpers/jwt';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export interface AuthRequest extends Request {
    user?: { _id: string };
}

export const auth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new UnauthorizedError('Необходима авторизация'));
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token) as { _id: string };

        req.user = { _id: payload._id };
        next();
    } catch (err) {
        next(new UnauthorizedError('Необходима авторизация'));
    }
};
