import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { methods as authenticationut } from './controllers/authentication.controller.js';

const app = express();
const PORT = 3000;

//Archivos estáticos
app.use(express.static(__dirname + "/public"));
app.use(express.json());

//Rutas personalizadas
app.get('/', (req, res) => {res.sendFile(__dirname + "/pages/index.html");});
app.get('/contact', (req, res) => {res.sendFile(__dirname + "/pages/contact.html");});
app.get('/login', (req, res) => {res.sendFile(__dirname + "/pages/auth/login.html");});
app.get('/register', (req, res) => {res.sendFile(__dirname + "/pages/auth/register.html");})

//End Points
app.post('/api/auth/register', authenticationut.register);
app.post('/api/auth/login', authenticationut.login);




app.listen(PORT, () => {console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);});