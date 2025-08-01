import Reservation from '../models/reservations.js';

//Muestra las reservas pendientes
export const getPendientes = async (req, res) => {
  try {
    const pendientes = await Reservation.find({ estado: 'pendiente' });
    res.json(pendientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas pendientes' });
  }
};

// Aprobar una reservación
export const approveReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reservation.findByIdAndUpdate(
      id,
      { estado: 'aceptada' },
      { new: true }
    );
    if (!reserva) return res.status(404).json({ message: 'Reservación no encontrada' });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al aprobar la reservación' });
  }
};

// Rechazar
export const rejectReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reservation.findByIdAndUpdate(
      id,
      { estado: 'rechazada' },
      { new: true }
    );
    if (!reserva) return res.status(404).json({ message: 'Reservación no encontrada' });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al rechazar la reservación' });
  }
};

// Editar
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const reserva = await Reservation.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    if (!reserva) return res.status(404).json({ message: 'Reservación no encontrada' });
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al editar la reservación' });
  }
};
