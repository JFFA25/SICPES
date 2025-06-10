import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

//Archivos estáticos
app.use(express.static(__dirname + "/public"));

//Rutas personalizadas
app.get('/', (req, res) => {res.sendFile(__dirname + "/pages/index.html");});
app.get('/login', (req, res) => {res.sendFile(__dirname + "/pages/login.html");});
app.get('/register', (req, res) => {res.sendFile(__dirname + "/pages/register.html");});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});