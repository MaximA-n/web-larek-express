import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import User from '../models/user';
import { generateTokens, verifyRefreshToken } from '../helpers/jwt';
import { REFRESH_TOKEN_COOKIE, cookieOptions } from '../helpers/cookie';
import { BadRequestError } from '../errors/BadRequestError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { NotFoundError } from '../errors/NotFoundError';
import { ConflictError } from '../errors/ConflictError';
import { AuthRequest } from '../middlewares/auth';

const sendTokens = (res: Response, accessToken: string, refreshToken: string, user: { email: string; name: string }) => {
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions);
    res.json({
        user: { email: user.email, name: user.name },
        success: true,
        accessToken,
    });
};

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        const { accessToken, refreshToken } = generateTokens(user._id.toString());

        user.tokens = [{ token: refreshToken }];
        await user.save();

        sendTokens(res, accessToken, refreshToken, user);
    } catch (err) {
        if (err instanceof Error && err.message.includes('E11000')) {
            return next(new ConflictError('Пользователь с таким email уже существует'));
        }
        if (err instanceof MongooseError.ValidationError) {
            return next(new BadRequestError(err.message));
        }
        return next(err);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password +tokens');
        if (!user) {
            return next(new UnauthorizedError('Неверный email или пароль'));
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new UnauthorizedError('Неверный email или пароль'));
        }

        const { accessToken, refreshToken } = generateTokens(user._id.toString());

        user.tokens.push({ token: refreshToken });
        await user.save();

        sendTokens(res, accessToken, refreshToken, user);
    } catch (err) {
        return next(err);
    }
};

export const refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.cookies[REFRESH_TOKEN_COOKIE];
        if (!token) {
            return next(new UnauthorizedError('Refresh-токен отсутствует'));
        }

        const payload = verifyRefreshToken(token) as { _id: string };

        const user = await User.findById(payload._id).select('+tokens');
        if (!user) {
            return next(new NotFoundError('Пользователь не найден'));
        }

        const tokenExists = user.tokens.some((t) => t.token === token);
        if (!tokenExists) {
            return next(new UnauthorizedError('Невалидный refresh-токен'));
        }

        user.tokens = user.tokens.filter((t) => t.token !== token);
        const { accessToken, refreshToken } = generateTokens(user._id.toString());
        user.tokens.push({ token: refreshToken });
        await user.save();

        sendTokens(res, accessToken, refreshToken, user);
    } catch (err) {
        next(new UnauthorizedError('Невалидный или просроченный refresh-токен'));
    }
};

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token = req.cookies[REFRESH_TOKEN_COOKIE];
        if (!token) {
            return next(new UnauthorizedError('Refresh-токен отсутствует'));
        }

        const payload = verifyRefreshToken(token) as { _id: string };

        const user = await User.findById(payload._id).select('+tokens');
        if (!user) {
            return next(new NotFoundError('Пользователь не найден'));
        }

        user.tokens = user.tokens.filter((t) => t.token !== token);
        await user.save();

        res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/' });
        res.json({ success: true });
    } catch (err) {
        next(new UnauthorizedError('Невалидный или просроченный refresh-токен'));
    }
};

export const getCurrentUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            return next(new NotFoundError('Пользователь не найден'));
        }

        res.json({
            user: { email: user.email, name: user.name },
            success: true,
        });
    } catch (err) {
        return next(err);
    }
};
