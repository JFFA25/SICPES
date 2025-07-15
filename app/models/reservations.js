import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  // Información Personal
  nombreCompleto: {
    type: String,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  universidad: {
    type: String,
    enum: ['utxj', 'iedep']
  },
  // Detalles de la Reserva
  cuatrimestre: {
    type: String,
    enum: ['Enero-Abril', 'Mayo-Agosto', 'Septiembre-Diciembre']
  },
  fechaIngreso: {
    type: Date
  },
  fechaSalida: {
    type: Date
  },
  tipoCuarto: {
    type: String,
    enum: ['individual', 'compartida', 'dormitorio']
  },
  piso: {
    type: Number,
    required: true
  },
  habitacion: {
    type: Number,
    requiere:true
  },
  montoMensual: { 
    type: Number
  }
}, {
  timestamps: true
});

export default mongoose.model('Reservation', reservationSchema);