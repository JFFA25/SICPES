import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SICPES');
    console.log('Conectado a MongoDB correctamente');
  } catch (error) {
    console.error(' Error al conectar a MongoDB', error);
    process.exit(1);
  }
};

export default connectDB;