import Payment from '../models/payments.js';
import Reservation from '../models/reservations.js';

export const processPayment = async (req, res) => {
  try {
    const { reservationId, numeroTarjeta, nombreEnTarjeta, fechaExpiracion, CVV } = req.body;

    const reserva = await Reservation.findById(reservationId);
    if (!reserva) return res.status(404).json({ message: 'Reservación no encontrada' });

    // Guardar el pago en la colección
    const nuevoPago = new Payment({
      numeroTarjeta,
      nombreEnTarjeta,
      fechaExpiracion,
      CVV
    });
    await nuevoPago.save();

    // Calcular nueva fecha de vencimiento (próximo mes)
    const nuevaFecha = new Date(reserva.fechaVencimiento);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);

    // Actualizar estado y fecha de vencimiento
    reserva.estadoPago = 'Pagado'; // Opcional si usas estadoPago como texto
    reserva.isPaid = true;
    reserva.fechaVencimiento = nuevaFecha;

    await reserva.save();

    res.status(200).json({ message: 'Pago procesado con éxito.', updatedReservation: reserva });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ message: 'Error al procesar el pago.' });
  }
};

export const paymentHistory = async (req, res) => {
  try {
    const pagos = await Payment.find().sort({ createdAt: -1 }); 
    res.status(200).json(pagos);
  } catch (error) {
    console.error('Error al obtener el historial de pagos:', error);
    res.status(500).json({ message: 'Error al obtener el historial de pagos' });
  }
};
