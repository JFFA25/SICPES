import { randomBytes } from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/mailer.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
    }

    // Verificar si está verificado
    if (!user.verified) {
      return res.status(403).json({ error: 'Tu correo aún no ha sido verificado.' });
    }

    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
    }

    // Éxito: puedes generar token JWT aquí si quieres
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

    const verificationToken = randomBytes(32).toString('hex');

    const user = new User({
      email,
      password,
      verificationToken,
      verified: false
    });

    await user.save();
    console.log(user)

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
    console.log('Token recibido:', token);

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).send('Token inválido o usuario no encontrado.');
    }

   user.verified = true;
   user.verificationToken = '';
    await user.save();

    res.redirect('/login'); 

  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno del servidor.');
  }
};
