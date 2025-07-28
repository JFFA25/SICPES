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
      habitacion,
      montoMensual
    } = req.body;

    const nuevaReserva = new Reservation({
      nombreCompleto,
      telefono,
      universidad,
      fechaIngreso,
      fechaSalida,
      tipoCuarto,
      piso,
      habitacion,
      montoMensual
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

export const getReservation = async (req, res) => {
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