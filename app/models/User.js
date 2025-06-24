import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  verificationToken: String,
  verified: {
    type: Boolean,
    default: false
  },
// Campos NECESARIOS para recuperación de contraseña
  forgetPasswordToken: String,
   verified:{
    type: Boolean,
    default: false
   },    
  forgetPasswordExpires: Date       
}, { 
  timestamps: true 
});

export default mongoose.model('User', userSchema);