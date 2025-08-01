import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { fileURLToPath } from "url";
import usersRoutes from "./routes/authentication.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import connectDB from "./db/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a la base de datos
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true
}));

// Middleware para cookies y sesiones
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 60 * 60 * 24 
  }),
  cookie: {
    secure: false, 
    httpOnly: true,
    sameSite: 'lax'
  }
}));


// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos públicos (css, js, imágenes)
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/auth", usersRoutes);
app.use("/api/dashboard", reservationRoutes);
app.use('/api/admin', adminRoutes);

// Rutas para páginas HTML
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/index.html"))
);
app.get("/contact", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/contact.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/auth/login.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/auth/register.html"))
);
app.get("/verified", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/auth/verified.html"))
);
app.get("/home", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/dashboard/home.html"))
);
app.get("/forgetPassword", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/auth/forgetPassword.html"))
);
app.get("/resetPassword", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/auth/resetPassword.html"))
);
app.get("/reservations", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/dashboard/reservations.html"))
);
app.get("/payments", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/dashboard/payments.html"))
);
app.get("/admin", (req, res) =>
  res.sendFile(path.join(__dirname, "pages/admin/home.html"))
);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});