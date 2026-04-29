import { celebrate, Joi, Segments } from 'celebrate';

export const validateCreateProduct = celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().min(2).max(30).required()
            .messages({
                'string.min': 'Минимальная длина поля "title" - 2',
                'string.max': 'Максимальная длина поля "title" - 30',
                'any.required': 'Поле "title" обязательно',
            }),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }).required(),
        category: Joi.string().required()
            .messages({
                'any.required': 'Поле "category" обязательно',
            }),
        description: Joi.string().optional(),
        price: Joi.number().allow(null).default(null),
    }),
});

export const validateProductId = celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        productId: Joi.string().hex().length(24).required()
            .messages({
                'string.hex': 'Невалидный id товара',
                'string.length': 'Невалидный id товара',
            }),
    }),
});

export const validateCreateOrder = celebrate({
    [Segments.BODY]: Joi.object().keys({
        items: Joi.array()
            .items(Joi.string().hex().length(24))
            .min(1)
            .required()
            .messages({
                'array.min': 'Массив товаров не может быть пустым',
                'any.required': 'Поле "items" обязательно',
            }),
        total: Joi.number().required()
            .messages({
                'any.required': 'Поле "total" обязательно',
            }),
        payment: Joi.string().valid('card', 'online').required()
            .messages({
                'any.only': 'Поле "payment" должно быть card или online',
                'any.required': 'Поле "payment" обязательно',
            }),
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Некорректный email',
                'any.required': 'Поле "email" обязательно',
            }),
        phone: Joi.string().required()
            .messages({
                'any.required': 'Поле "phone" обязательно',
            }),
        address: Joi.string().required()
            .messages({
                'any.required': 'Поле "address" обязательно',
            }),
    }),
});

export const validateRegister = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().min(2).max(30).optional(),
        email: Joi.string().email().required()
            .messages({ 'any.required': 'Поле "email" обязательно' }),
        password: Joi.string().min(6).required()
            .messages({ 'any.required': 'Поле "password" обязательно' }),
    }),
});

export const validateLogin = celebrate({
    [Segments.BODY]: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
});

export const validateUpdateProduct = celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().min(2).max(30).optional(),
        image: Joi.object().keys({
            fileName: Joi.string().required(),
            originalName: Joi.string().required(),
        }).optional(),
        category: Joi.string().optional(),
        description: Joi.string().optional(),
        price: Joi.number().allow(null).optional(),
    }),
});
