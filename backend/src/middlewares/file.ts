import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_PATH_TEMP } from '../config';

const ALLOWED_MIME_TYPES = [
    'image/jpeg', 
    'image/jpg',
    'image/png', 
    'image/gif', 
    'image/webp', 
    'image/svg+xml',
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', UPLOAD_PATH_TEMP));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    },
});

const fileMiddleware = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // максимум 5MB
    },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
    } else {
        cb(new Error('Недопустимый тип файла'));
    }
    },
});

export default fileMiddleware;
