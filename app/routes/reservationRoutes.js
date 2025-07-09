import { Router } from "express";
import {createReservation} from "../controllers/reservations.controller.js";
const router = Router();

router.post('/reservation',createReservation)

export default router;