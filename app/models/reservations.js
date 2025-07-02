import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipoCuarto: {
    type: String,
    enum: ['privado', 'compartido'],
    required: true
  },
  totalPersonas: {
    type: Number,
    required: true,
    min: 1
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada'],
    default: 'pendiente'
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ReservaEstudiante', reservaSchema);