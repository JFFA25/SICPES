import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";// En tu index.js
import cors from 'cors';
import { fileURLToPath } from "url";
import usersRoutes from "./routes/authentication.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import connectDB from "./db/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//Routing
app.use("/api/auth", usersRoutes);
app.use("/api/dashboard", reservationRoutes);
app.use('/api/admin', adminRoutes); 



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


app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});
