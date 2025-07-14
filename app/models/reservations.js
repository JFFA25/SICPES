import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  universidad: {
    type: String,
    required: true,
  },
  fechaIngreso: {
    type: Date,
    required: true,
  },
  fechaSalida: {
    type: Date,
    required: true,
  },
  tipoCuarto: {
    type: String,
    required: true,
    enum: ['individual', 'compartida', 'dormitorio'],
  },
  piso: {
    type: Number,
    required: true,
  },
  habitacion: {
    type: Number,
    required: true,
  }, monto: {
    type: Number,
    required: true
  },
  fechaVencimiento: { // ¡Campo agregado!
    type: Date,
    required: true
  }
}, {
  timestamps: true,
});

export default mongoose.model('Reservation', reservationSchema);
