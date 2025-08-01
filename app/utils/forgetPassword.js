import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function forgetPasswordEmail(email, token) {
    const resetUrl = token
    const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Restablece tu contraseña',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="text-align: center; padding: 30px 0; background-color: #2e7d32; color: white;">
          <img src="http://localhost:3000/assets/SICPES.png" alt="Logo SICPES" style="height: 60px;">
          <h1 style="font-weight: 500; margin: 15px 0 0 0;">Restablecer Contraseña</h1>
        </div>
        
        <!-- Contenido -->
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; line-height: 1.6; color: #424242; margin-bottom: 10px;">
            Hola, recibimos una solicitud para restablecer tu contraseña.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #616161;">
            Si no hiciste esta solicitud, puedes ignorar este mensaje. De lo contrario, haz clic en el botón para establecer una nueva contraseña. Este enlace es válido por 15 minutos.
          </p>
          
          <!-- Botón principal -->
          <div style="text-align: center; margin: 35px 0 40px 0;">
            <a href="${resetUrl}" 
               style="background-color: #2e7d32; color: white; text-decoration: none; padding: 14px 35px; 
                      border-radius: 4px; font-weight: 500; display: inline-block; font-size: 16px;
                      letter-spacing: 0.5px;">
              Restablecer contraseña
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f5f7fa; padding: 25px 30px; border-top: 1px solid #e0e0e0;">
          <div style="text-align: center; margin-bottom: 15px;">
            <img src="https://imgur.com/a/7QnSVx8" alt="Logo SICPES" style="height: 30px; opacity: 0.8;">
            <div style="font-size: 14px; color: #2e7d32; font-weight: 500; margin-top: 5px;">
              Sistema Integral de Control de Pensión de Estudiantes
            </div>
          </div>
          
          <div style="text-align: center; margin: 15px 0; font-size: 13px;">
            <a href="#" style="color: #616161; text-decoration: none; margin: 0 10px;">Aviso de privacidad</a>
            <a href="#" style="color: #616161; text-decoration: none; margin: 0 10px;">Términos de uso</a>
            <a href="/contact" style="color: #616161; text-decoration: none; margin: 0 10px;">Contacto</a>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #9e9e9e; margin-top: 15px;">
            &copy; 2025 SICPES. Todos los derechos reservados.
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}
