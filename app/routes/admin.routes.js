import { Router } from 'express';
import { getPendingReservations, cambiarEstadoReservacion, eliminarReservacion, getAllReservations, getReservationById } from '../controllers/admin.controller.js';

const router = Router();


router.get('/reservations', getPendingReservations); // Cambiado a /reservations
router.put('/reservations/:id/status', cambiarEstadoReservacion);
router.delete('/reservations/:id', eliminarReservacion);
router.get('/reservations', getAllReservations);
router.get('/reservations/:id', getReservationById);

export default router;