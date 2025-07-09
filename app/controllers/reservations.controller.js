import Reservation from '../models/reservations.js';
export const createReservation = async (req, res) => {
  try {
    const {
      nombreCompleto,
      telefono,
      universidad,
      fechaIngreso,
      fechaSalida,
      tipoCuarto,
      piso,
      habitacion
    } = req.body;

    const nuevaReserva = new Reservation({
      nombreCompleto,
      telefono,
      universidad,
      fechaIngreso,
      fechaSalida,
      tipoCuarto,
      piso,
      habitacion
    });

    await nuevaReserva.save();

    res.status(201).json({ message: 'Reservación creada correctamente', reserva: nuevaReserva });
  } catch (error) {
    console.error('Error al crear la reservación:', error); // <--- este es el importante
    res.status(500).json({ message: 'Error al crear la reservación', error });
  }
};
