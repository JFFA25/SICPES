//  Cargar variables de entorno

import dotenv from 'dotenv';
dotenv.config();


// Importar módulos principales

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';


// mportar módulos internos

import usersRoutes from './routes/usersRoutes.js';
import connectDB from './db/db.js';


// Configurar app y paths

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//  Conectar a la base de datos

connectDB();

//  Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Formularios HTML
app.use(express.static(path.join(__dirname, 'public')));


// Rutas de la API

app.use('/api/auth', usersRoutes);


//  Rutas HTML

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages/index.html'))
);
app.get('/contact', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages/contact.html'))
);
app.get('/login', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages/auth/login.html'))
);
app.get('/register', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages/auth/register.html'))
);


// Iniciar servidor-
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
