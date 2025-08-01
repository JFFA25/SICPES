import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  _id:Number,// ID numerico
  usuario: {
    type: Number,
    ref: 'User',
    required: true
  },
  // Detalles de la Reserva
  fechaIngreso: {
    type: Date,
    required: true
  },
  fechaSalida: {
    type: Date
  },
  tipoCuarto: {
    type: String,
    enum: ['individual', 'compartida', 'dormitorio'],
    required: true
  },
  piso: {
    type: Number,
    required: true
  },
  habitacion: {
    type: Number,
    required: true
  },
  montoMensual: {
    type: Number,
    required: true
  },
  estudiantesCompartida: {
    type: Number // Solo se usa si tipoCuarto es 'compartida'
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aceptada', 'rechazada', 'finalizada'],
    default: 'pendiente'
  }
}, { timestamps: true });


export default mongoose.model('Reservation', reservationSchema);