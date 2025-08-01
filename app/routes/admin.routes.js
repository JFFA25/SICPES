import { Router } from 'express';
import { getPendientes ,approveReservation,rejectReservation,updateReservation} from '../controllers/admin.controller.js';
import { getReservations } from '../controllers/reservations.controller.js';

const router = Router(); 

// Cambiar a GET (para obtener datos)
router.get('/reservas-pendientes', getPendientes);

// Obtener todas las reservaciones (para el admin)
router.get('/getReservations',getReservations);

// Aprobar una reservación
router.put('/reservations/:id/approve', approveReservation);

// Rechazar (eliminar lógicamente) una reservación
router.put('/reservations/:id/reject', rejectReservation);

// Editar una reservación
router.put('/reservations/:id', updateReservation);

export default router;