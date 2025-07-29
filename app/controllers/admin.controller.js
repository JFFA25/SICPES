import Reservation from '../models/reservations.js';

export const getPendingReservations = async (req, res) => {
  try {
    const reservaciones = await Reservation.find({ estado: 'pendiente' })
      .sort({ createdAt: -1 }); // Ordena por las más recientes primero
    
    if (!reservaciones.length) {
      return res.status(200).json([]); // Devuelve array vacío si no hay
    }

    res.status(200).json(reservaciones);
  } catch (error) {
    console.error('Error al obtener reservaciones:', error);
    res.status(500).json({ 
      error: 'Error al obtener reservaciones',
      details: error.message 
    });
  }
};
export const cambiarEstadoReservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const reservacion = await Reservation.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!reservacion) {
      return res.status(404).json({ error: 'Reservación no encontrada' });
    }

    res.status(200).json(reservacion);
  } catch (error) {
    res.status(400).json({ 
      error: 'Error al actualizar el estado',
      details: error.message 
    });
  }
};
export const eliminarReservacion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Reservation.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Reservación no encontrada' });
    res.status(200).json({ message: 'Reservación eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la reservación', details: error.message });
  }
};
export const getAllReservations = async (req, res) => {
  try {
    const reservaciones = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json(reservaciones);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener todas las reservaciones',
      details: error.message 
    });
  }
};
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservacion = await Reservation.findById(id);
    if (!reservacion) {
      return res.status(404).json({ error: 'Reservación no encontrada' });
    }
    res.status(200).json(reservacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la reservación', details: error.message });
  }
};