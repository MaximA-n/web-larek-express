import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import {
    AUTH_ACCESS_TOKEN_SECRET,
    AUTH_REFRESH_TOKEN_SECRET,
    AUTH_ACCESS_TOKEN_EXPIRY,
    AUTH_REFRESH_TOKEN_EXPIRY,
} from '../config';

export const generateTokens = (userId: string) => {
    const accessToken = jwt.sign(
        { _id: userId },
        AUTH_ACCESS_TOKEN_SECRET,
        { expiresIn: AUTH_ACCESS_TOKEN_EXPIRY as StringValue },
    );

    const refreshToken = jwt.sign(
        { _id: userId },
        AUTH_REFRESH_TOKEN_SECRET,
        { expiresIn: AUTH_REFRESH_TOKEN_EXPIRY as StringValue },
    );

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => jwt.verify(
    token,
    AUTH_ACCESS_TOKEN_SECRET,
);

export const verifyRefreshToken = (token: string) => jwt.verify(
    token,
    AUTH_REFRESH_TOKEN_SECRET,
);
