import express from 'express';
import  { createBrand, getAllBrands, updateBrand, deleteBrand, getBrandBySlug } from '../controllers/Brand.js';

const router  = express.Router();
router.post('/createBrand', createBrand);
router.get('/getAllBrands', getAllBrands);
router.get('/getBrandBySlug', getBrandBySlug);
router.put('/updateBrand', updateBrand);
router.put('/deleteBrand', deleteBrand);
export default router;