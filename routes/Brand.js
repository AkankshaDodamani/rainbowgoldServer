import express from 'express';
import  { createBrand } from '../controllers/Brand.js';

const router  = express.Router();
router.post('/createBrand', createBrand);
export default router;