import express from 'express';
import  { createBrand, getAllBrands, updateBrand, deleteBrand, getBrandBySlug } from '../controllers/Brand.js';
import { verifyToken } from '../middleware/generateToken.js'; // Import the middleware

const router  = express.Router();
router.post('/createBrand',verifyToken, createBrand);
router.get('/getAllBrands', getAllBrands);
router.get('/getBrandBySlug', getBrandBySlug);
router.put('/updateBrand', verifyToken, updateBrand);
router.put('/deleteBrand', verifyToken, deleteBrand);
export default router;