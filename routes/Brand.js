import express from 'express';
import  { createBrand, getAllBrands, updateBrand, deleteBrand } from '../controllers/Brand.js';

const router  = express.Router();
router.post('/createBrand', createBrand);
router.get('/getAllBrands', getAllBrands);
router.put('/updateBrand/:brandname', updateBrand);
router.put('/deleteBrand/:brandname', deleteBrand);
export default router;