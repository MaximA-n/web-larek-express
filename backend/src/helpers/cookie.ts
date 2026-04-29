import ms from 'ms';
import { CookieOptions } from 'express';
import { AUTH_REFRESH_TOKEN_EXPIRY } from '../config';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: ms(AUTH_REFRESH_TOKEN_EXPIRY as ms.StringValue),
    path: '/',
};
