import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRoutes from './routes/usersRoutes.js';
import connectDB from './db/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth', usersRoutes);

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
app.get('/verified', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages/auth/verified.html'))
);
app.get('/home', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages/dashboard/home.html'))
);
app.get('/forgetPassword', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages/auth/forgetPassword.html'))
);

app.get('/resetPassword', (req, res) =>
  res.sendFile(path.join(__dirname, 'pages/auth/resetPassword.html'))
);



app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
