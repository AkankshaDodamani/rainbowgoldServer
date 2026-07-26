import express from 'express';
import { CreateProduct, GetAllProductsByBrand, UpdateProduct, DeleteProduct } from '../controllers/Product.js';

const router = express.Router();
router.post('/createProduct', CreateProduct);
router.get('/getAllProductsByBrand', GetAllProductsByBrand);
router.put('/updateProduct', UpdateProduct);
router.put('/deleteProduct', DeleteProduct);
export default router;