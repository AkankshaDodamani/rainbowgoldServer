import express from 'express';
import { CreateProduct, GetAllProductsByBrand, UpdateProduct, DeleteProduct } from '../controllers/Product.js';
import { verifyToken } from '../middleware/generateToken.js'; // Import the middleware

const router = express.Router();
router.post('/createProduct', verifyToken, CreateProduct);
router.get('/getAllProductsByBrand', GetAllProductsByBrand);
router.put('/updateProduct',verifyToken, UpdateProduct);
router.put('/deleteProduct',verifyToken, DeleteProduct);
export default router;