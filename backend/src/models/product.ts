import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs/promises';
import { UPLOAD_PATH } from '../config';

interface IProduct {
    title: string;
    image: {
        fileName: string;
        originalName: string;
    };
    category: string;
    description?: string;
    price: number | null;
}

const productSchema = new mongoose.Schema<IProduct>({
    title: {
        type: String,
        minlength: 2, 
        maxlength: 30, 
        required: true,
        unique: true,
    },
    image: {
        fileName: {
            type: String,
            required: true,
        },
        originalName: {
            type: String,
            required: true,
        }
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: null,
    },
});

productSchema.post('findOneAndDelete', async (doc) => {
    if (doc?.image?.fileName) {
        const name = path.basename(doc.image.fileName);
        const filePath = path.join(__dirname, '..', 'public', UPLOAD_PATH, name);
        await fs.unlink(filePath).catch(() => null);
    }
});

export default mongoose.model<IProduct>('product', productSchema);
