import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/mailer.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuario no encontrado con ese correo.");
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
    }

    console.log("Usuario encontrado:", user);

    if (!user.verified) {
      return res.status(403).json({ error: 'Tu correo aún no ha sido verificado.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("¿Contraseña coincide?", passwordMatch);

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    // ✅ Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = randomBytes(32).toString('hex');

    const user = new User({
      email,
      password: hashedPassword, // Usa la contraseña hasheada aquí
      verificationToken,
      verified: false
    });

    await user.save();

    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    res.status(201).json({ message: 'Usuario registrado. Revisa tu correo para verificar.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error Interno del Servidor.' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send('Token inválido o usuario no encontrado.');
    }

    user.verified = true;
    user.verificationToken = '';
    await user.save();

    res.redirect('/verified');

  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor.');
  }
};
