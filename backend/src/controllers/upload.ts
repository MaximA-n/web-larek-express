import { Request, Response, NextFunction } from 'express';
import { UPLOAD_PATH } from '../config';

export const uploadFile = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
    if (!req.file) {
        res.status(400).json({ message: 'Файл не передан' });
        return;
    }

    res.json({
        fileName: `/${UPLOAD_PATH}/${req.file.filename}`,
        originalName: req.file.originalname,
    });
    } catch (err) {
        next(err);
    }
};
