import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configurar el transporte de Brevo (antes Sendinblue)
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.BREVO_SMTP_USER, // Tu email de login de Brevo
    pass: process.env.BREVO_SMTP_KEY,  // Tu API key de Brevo
  },
});

// Generar token de verificación
export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Enviar email de verificación
export async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@tudominio.com',
    to: email,
    subject: 'Verifica tu correo electrónico',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verifica tu correo electrónico</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Gracias por registrarte. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el botón de abajo:</p>
              <center>
                <a href="${verificationUrl}" class="button">Verificar correo electrónico</a>
              </center>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p><strong>Este enlace expirará en 24 horas.</strong></p>
              <p>Si no creaste una cuenta con nosotros, puedes ignorar este correo.</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Verifica tu correo electrónico

      Hola,

      Gracias por registrarte. Para completar tu registro, por favor verifica tu correo electrónico visitando:

      ${verificationUrl}

      Este enlace expirará en 24 horas.

      Si no creaste una cuenta con nosotros, puedes ignorar este correo.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar email de verificación:', error);
    return { success: false, error: error.message };
  }
}

// Enviar email de bienvenida después de verificar
export async function sendWelcomeEmail(email, name) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'noreply@tudominio.com',
    to: email,
    subject: '¡Bienvenido! Tu cuenta ha sido verificada',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10B981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #10B981;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido${name ? ' ' + name : ''}!</h1>
            </div>
            <div class="content">
              <p>Tu correo electrónico ha sido verificado exitosamente.</p>
              <p>Ya puedes acceder a todas las funcionalidades de tu cuenta.</p>
              <center>
                <a href="${process.env.NEXTAUTH_URL}/mi-cuenta/login" class="button">Iniciar sesión</a>
              </center>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error al enviar email de bienvenida:', error);
    return { success: false, error: error.message };
  }
}
