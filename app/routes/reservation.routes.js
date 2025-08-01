import { Router } from "express";
import {createReservation,getReservations,getUserReservations} from "../controllers/reservations.controller.js";
const router = Router();

router.post('/reservation',createReservation);
router.get('/getReservations',getReservations);
router.get('/getUserReservation',getUserReservations);

export default router;