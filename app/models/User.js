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
  forgetPasswordToken: String,
  forgetPasswordExpires: Date,
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  }

}, { 
  timestamps: true 
});

export default mongoose.model('User', userSchema);
