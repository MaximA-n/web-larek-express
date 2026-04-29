import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { ConflictError } from '../errors/ConflictError';
import { Error as MongooseError } from 'mongoose';
import { BadRequestError } from '../errors/BadRequestError';
import path from 'node:path';
import { UPLOAD_PATH, UPLOAD_PATH_TEMP } from '../config';
import fs from 'fs/promises';
import { NotFoundError } from '../errors/NotFoundError';

const moveFile = async (fileName: string) => {
    const name = path.basename(fileName);
    const tempPath = path.join(__dirname, '..', 'public', UPLOAD_PATH_TEMP, name);
    const finalPath = path.join(__dirname, '..', 'public', UPLOAD_PATH, name);

    await fs.rename(tempPath, finalPath);
};

export const getProducts = async ( req: Request, res: Response, next: NextFunction, ) => {
    try {
        const items = await Product.find();
        res.json({ items, total: items.length})
    } catch (err) {
        return next(err);
    }
};

export const createProduct = async ( req: Request, res: Response, next: NextFunction, ) => {
    try {
        const { title, image, category, description, price } = req.body;
        if (image?.fileName) {
            await moveFile(image.fileName);
        }
        const product = await Product.create({
            title, image, category, description, price, 
        });
        res.status(201).json(product);
    } catch (err) {
        if (err instanceof Error && err.message.includes('E11000')) {
            return next(new ConflictError('Товар с таким названием уже существует'));
        }

        if (err instanceof MongooseError.ValidationError) {
            return next(new BadRequestError(err.message));
        }
        return next(err);
    }
};

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = req.params;
        const { title, image, category, description, price } = req.body;

        if (image?.fileName) {
            await moveFile(image.fileName);
        }

        const product = await Product.findByIdAndUpdate(
            productId,
            { title, image, category, description, price },
            { new: true, runValidators: true },
        );

        if (!product) {
            return next(new NotFoundError('Товар не найден'));
        }

        res.json(product);
    } catch (err) {
        if (err instanceof Error && err.message.includes('E11000')) {
            return next(new ConflictError('Товар с таким названием уже существует'));
        }
        if (err instanceof MongooseError.ValidationError) {
            return next(new BadRequestError(err.message));
        }
        return next(err);
    }
};

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return next(new NotFoundError('Товар не найден'));
        }

        res.json(product);
    } catch (err) {
        return next(err);
    }
};
