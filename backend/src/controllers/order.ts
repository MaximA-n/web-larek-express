import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import { faker } from '@faker-js/faker';
import { BadRequestError } from '../errors/BadRequestError';

export const createOrder = async ( req: Request, res: Response, next: NextFunction, ) => {
    try {
        const { total, items } =req.body;

        const products = await Product.find({ _id: { $in: items }});
        if (products.length !== items.length) {
            return next(new BadRequestError('Один или несколько товаров не найдены'));
        }

        const hasNullPrice = products.some((p) => p.price === null);
        if (hasNullPrice) {
            return next(new BadRequestError('Один или несколько товаров не продаются'));
        }

        const calculatedTotal = products.reduce((sum, p) => sum + (p.price as number), 0);
        if (calculatedTotal !== total) {
        return next(new BadRequestError('Сумма заказа не совпадает'));
        }

        res.json({ 
            id: faker.string.uuid(),
            total,
        });
    }   catch (err) {
        return next(err);
    }
};