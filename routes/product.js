import express from 'express';
import { CreateProduct, GetAllProductsByBrand, UpdateProduct, DeleteProduct, GetAllProducts } from '../controllers/Product.js';
import { verifyToken } from '../middleware/generateToken.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();
router.post('/createProduct', verifyToken, upload.single('productphotolink'), CreateProduct);
router.get('/getAllProductsByBrand', GetAllProductsByBrand);
router.put("/updateProduct", verifyToken, upload.single('productphotolink'), UpdateProduct);
router.put('/deleteProduct',verifyToken, DeleteProduct);
router.get('/getAllProducts', GetAllProducts);
export default router;