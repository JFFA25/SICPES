import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/mailer.js';
import { forgetPasswordEmail } from '../utils/forgetPassword.js';

//Validar usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Todos los campos deben de ser completados.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
    }

    if (!user.verified) {
      return res.status(403).json({ error: 'Tu correo aún no ha sido verificado.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
    }

    // Éxito: responder con JSON
    return res.status(200).json({ redirectTo: '/home' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};



//Registrar usario
export const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Todos los campos deben de ser completados.' });
    }

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


    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = randomBytes(32).toString('hex');

    const user = new User({
      email,
      password: hashedPassword,
      verificationToken,
      verified: false
    });

    await user.save();

    const verificationUrl = `http://localhost:3000/api/auth/verifyEmail?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    res.status(201).json({ message: 'Te enviamos un correo para confirmar tu cuenta. Por favor, revisa tu bandeja de entrada.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error Interno del Servidor.' });
  }
};

//Verificacion de Correo
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

//Restablcer contraseña
export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Correo no registrado' });

    // Genera token y fecha de expiración (15 minutos)
    const token = randomBytes(32).toString('hex');
    user.forgetPasswordToken = token;
    user.forgetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutos
    await user.save();

    const resetUrl = `http://localhost:3000/resetPassword?token=${token}`;
    await forgetPasswordEmail(user.email, resetUrl);

    return res.status(200).json({ message: 'Se envió el correo de recuperación correctamente.' });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Hubo un error al enviar el correo.' });
  }
};

//Crear nueva contraseña
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    // Validación de longitud mínima
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    // Busca usuario con token válido y no expirado
    const user = await User.findOne({
      forgetPasswordToken: token,
      forgetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'El enlace ya fue utilizado o el token es inválido/expirado.' });
    }

    // Hashea la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.forgetPasswordToken = null; // Elimina el token para que sea de un solo uso
    user.forgetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
};

