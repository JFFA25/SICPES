import Reservation from '../models/reservations.js';
import { getNextSequence } from '../utils/getNextSequence.js';

export const createReservation = async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const {
      fechaIngreso,
      tipoCuarto,
      piso,
      habitacion,
      montoMensual
    } = req.body;

    // Obtener el siguiente ID numérico
    const nextId = await getNextSequence('reservations');

    const nuevaReserva = new Reservation({
      _id: nextId, // ← asigna el ID numérico
      usuario: userId,
      fechaIngreso,
      tipoCuarto,
      piso,
      habitacion,
      montoMensual,
      estado: 'pendiente'
    });

    await nuevaReserva.save();

    res.status(201).json({
      message: 'Reservación creada correctamente',
      reserva: nuevaReserva
    });
  } catch (error) {
    console.error('Error al crear la reservación:', error);
    res.status(500).json({
      message: 'Error al crear la reservación',
      error: error.message
    });
  }
};

// Controlador correcto para getReservations (para el admin)
export const getReservations = async (req, res) => {
  try {
    
    const reservas = await Reservation.find().populate('usuario'); 
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las reservaciones' });
  }
};

// obtener la reservación del usuario autenticado
export const getUserReservations = async (req, res) => {
  try {
    const reserva = await Reservation.findOne();
    if (!reserva) {
      return res.status(404).json({ message: "No hay reservaciones encontradas" });
    }
    res.status(200).json(reserva);
  } catch (error) {
    console.error('Error al obtener reservación:', error);
    res.status(500).json({ 
      message: "Error al obtener la reservación",
      error: error.message
    });
  }
};
