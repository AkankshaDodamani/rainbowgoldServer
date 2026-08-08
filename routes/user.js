import express from 'express';
import Login  from '../controllers/User.js';
import { refreshToken } from '../controllers/User.js';

const router = express.Router();

router.post('/login', Login);
router.post('/refresh', refreshToken); // Expose the endpoint

export default router;
