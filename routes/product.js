import express from 'express';
import { CreateProduct, GetAllProductsByBrand, UpdateProduct, DeleteProduct } from '../controllers/Product.js';

const router = express.Router();
router.post('/createProduct', CreateProduct);
router.get('/getAllProductsByBrand/:brandname', GetAllProductsByBrand);
router.put('/updateProduct/:productname', UpdateProduct);
router.put('/deleteProduct/:productname', DeleteProduct);
export default router;