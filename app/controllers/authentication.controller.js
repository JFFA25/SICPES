import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/mailer.js';
import { forgetPasswordEmail } from '../utils/forgetPassword.js';
import { getNextSequence } from '../utils/getNextSequence.js';


// Login 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Todos los campos deben ser completados.' });
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
    // Guardar el ID del usuario en la sesión
    req.session.userId = user._id;

    return res.status(200).json({
      message: 'Login exitoso',
      redirectTo: user.rol === 'admin' ? '/admin' : '/home',
      userId: user._id
    });


  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Registro 

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos deben ser completados.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    // Obtener ID numérico
    const userId = await getNextSequence('userId');

    const user = new User({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verified: false
    });

    await user.save();

    const verificationUrl = `http://localhost:3000/api/auth/verifyEmail?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationUrl);

    res.status(201).json({
      message: 'Correo de verificación enviado.',
      userId: userId // opcional para depuración
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


// Verificación de correo 
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

// Restablecer contraseña 
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Correo no registrado' });

    const token = randomBytes(32).toString('hex');
    user.forgetPasswordToken = token;
    user.forgetPasswordExpires = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetUrl = `http://localhost:3000/resetPassword?token=${token}`;
    await forgetPasswordEmail(user.email, resetUrl);

    return res.status(200).json({ message: 'Correo de recuperación enviado.' });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Hubo un error al enviar el correo.' });
  }
};

// Resetear contraseña (sin cambios)
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    const user = await User.findOne({
      forgetPasswordToken: token,
      forgetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Enlace inválido o expirado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.forgetPasswordToken = null;
    user.forgetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
};

// Crear admin (mejora opcional: incluir ID en respuesta)
export const crearAdmin = async (req, res) => {
  try {
    const name = 'Administrador SIC-PES';
    const email = 'admin.sicpes@gmail.com';
    const password = await bcrypt.hash('admin123', 10);

    const existe = await User.findOne({ email });
    if (existe) return res.send('Ya existe el admin');

    // Obtener el ID numérico incremental
    const adminId = await getNextSequence('userId');

    const admin = new User({
      _id: adminId,
      name,
      email,
      password,
      verified: true,
      rol: 'admin'
    });

    await admin.save();
    res.send('Administrador creado exitosamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el administrador');
  }
};