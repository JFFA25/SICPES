import { Router } from 'express';
import { register , verifyEmail , login } from '../controllers/authentication.controller.js';

const router = Router();
router.post('/register', register); 
router.post('/login', login);
router.get('/verify-email', verifyEmail); 

   
export default router;