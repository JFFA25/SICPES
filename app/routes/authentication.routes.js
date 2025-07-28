import { Router } from 'express';
import { register , verifyEmail , login,forgetPassword,resetPassword,crearAdmin} from '../controllers/authentication.controller.js';

const router = Router();
router.post('/register', register); 
router.post('/login', login);
router.get('/verifyEmail', verifyEmail); 
router.post('/forgetPassword',forgetPassword);
router.post('/resetPassword',resetPassword);
// Ruta para crear el admin (solo úsala una vez) 
router.get('/crear-admin', crearAdmin);
router.post('/crear-admin', crearAdmin);

export default router;