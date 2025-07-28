import { Router } from "express";
import {createReservation,getReservation} from "../controllers/reservations.controller.js";
const router = Router();

router.post('/reservation',createReservation)
router.get('/reservation', getReservation);
export default router;