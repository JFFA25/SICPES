import { Router } from "express";
import {processPayment,paymentHistory} from "../controllers/payments.controller.js";
const router = Router();

router.post('/process-payment',processPayment);
router.get('/payment-history',paymentHistory);

export default router;