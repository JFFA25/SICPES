import { Router } from 'express';
import { register , verifyEmail , login,forgetPassword,resetPassword} from '../controllers/authentication.controller.js';

const router = Router();
router.post('/register', register); 
router.post('/login', login);
router.get('/verifyEmail', verifyEmail); 
router.post('/forgetPassword',forgetPassword);
router.post('/resetPassword',resetPassword); 

   
export default router;