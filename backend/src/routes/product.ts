import { validateCreateProduct, validateProductId, validateUpdateProduct } from '../middlewares/validation';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product';
import { Router } from 'express';
import { auth } from '../middlewares/auth';

const productRouter = Router();

productRouter.get('/', getProducts);

productRouter.post('/', auth, validateCreateProduct, createProduct);
productRouter.patch('/:productId', auth, validateProductId, validateUpdateProduct, updateProduct);
productRouter.delete('/:productId', auth, validateProductId, deleteProduct);

export default productRouter;
