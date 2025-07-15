import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    numeroTarjeta: {
    type: String,
    required: true,
  },
   nombreEnTarjeta: {
    type: String,
    required: true, 
  },
    fechaExpiracion: {
    type: Date,
  },
  CVV:{
    type:Number,
    required: true,
  }
}

)

export default mongoose.model('Payment', paymentSchema);