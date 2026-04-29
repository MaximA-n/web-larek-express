import { validateCreateOrder } from '../middlewares/validation';
import { createOrder } from '../controllers/order';
import { Router } from 'express';

const orderRouter = Router();

orderRouter.post('/', validateCreateOrder, createOrder);

export default orderRouter;
