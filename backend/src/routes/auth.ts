import { Router } from 'express';
import {
    register,
    login,
    refreshAccessToken,
    logout,
    getCurrentUser,
} from '../controllers/auth';
import { validateRegister, validateLogin } from '../middlewares/validation';
import { auth } from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/register', validateRegister, register);
authRouter.post('/login', validateLogin, login);
authRouter.get('/token', refreshAccessToken);
authRouter.get('/logout', logout);

authRouter.get('/user', auth, getCurrentUser);

export default authRouter;
