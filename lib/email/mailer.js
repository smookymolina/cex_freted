import nodemailer from 'nodemailer';

// Configurar transporter
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  return nodemailer.createTransporter(config);
};

/**
 * Enviar email genérico
 */
export async function sendEmail({ to, subject, html, text }) {
  // Si no está configurado SMTP, solo loguear
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('[EMAIL] SMTP no configurado. Email que se enviaría:');
    console.log(`  Para: ${to}`);
    console.log(`  Asunto: ${subject}`);
    console.log(`  Contenido: ${text || html}`);
    return {
      success: false,
      message: 'SMTP no configurado',
      preview: { to, subject, text, html },
    };
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`[EMAIL] Enviado a ${to}: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('[EMAIL] Error al enviar:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Email de bienvenida
 */
export async function sendWelcomeEmail(userEmail, userName) {
  const subject = '¡Bienvenido a CEX Freted!';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0070f3; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a CEX Freted!</h1>
          </div>
          <div class="content">
            <p>Hola ${userName || 'Usuario'},</p>
            <p>Gracias por registrarte en CEX Freted, tu marketplace de confianza para productos tecnológicos reacondicionados.</p>
            <p>Con tu cuenta podrás:</p>
            <ul>
              <li>Comprar productos certificados con garantía de 12 meses</li>
              <li>Vender tus dispositivos usados</li>
              <li>Seguir el estado de tus pedidos</li>
              <li>Acceder a ofertas exclusivas</li>
            </ul>
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/comprar" class="button">
                Explorar catálogo
              </a>
            </div>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Saludos,<br><strong>El equipo de CEX Freted</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CEX Freted. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
¡Bienvenido a CEX Freted!

Hola ${userName || 'Usuario'},

Gracias por registrarte en CEX Freted, tu marketplace de confianza para productos tecnológicos reacondicionados.

Con tu cuenta podrás:
- Comprar productos certificados con garantía de 12 meses
- Vender tus dispositivos usados
- Seguir el estado de tus pedidos
- Acceder a ofertas exclusivas

Visita nuestro catálogo: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/comprar

Saludos,
El equipo de CEX Freted
  `;

  return sendEmail({ to: userEmail, subject, html, text });
}

/**
 * Email de confirmación de orden
 */
export async function sendOrderConfirmationEmail(userEmail, orderData) {
  const { orderId, total, items, deliveryMethod } = orderData;

  const subject = `Confirmación de pedido #${orderId}`;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: white; }
          th { background-color: #f3f4f6; padding: 10px; text-align: left; }
          .total { font-size: 1.25rem; font-weight: bold; color: #0070f3; text-align: right; padding: 15px 10px; background-color: #f3f4f6; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Pedido Confirmado</h1>
            <p style="font-size: 1.125rem; margin: 10px 0 0 0;">Pedido #${orderId}</p>
          </div>
          <div class="content">
            <p>Tu pedido ha sido confirmado y está siendo procesado.</p>

            <h3>Detalles del pedido:</h3>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style="text-align: center;">Cantidad</th>
                  <th style="text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total">
              Total: $${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </div>

            <p><strong>Método de entrega:</strong> ${deliveryMethod === 'DELIVERY' ? 'Envío a domicilio' : 'Recoger en tienda'}</p>

            <p>Recibirás una notificación cuando tu pedido esté en camino.</p>

            <p>Puedes ver el estado de tu pedido en tu cuenta.</p>

            <p>Saludos,<br><strong>El equipo de CEX Freted</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CEX Freted. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Pedido Confirmado - #${orderId}

Tu pedido ha sido confirmado y está siendo procesado.

Detalles del pedido:
${items.map((item) => `- ${item.name} x${item.quantity} - $${item.price.toLocaleString('es-MX')}`).join('\n')}

Total: $${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN

Método de entrega: ${deliveryMethod === 'DELIVERY' ? 'Envío a domicilio' : 'Recoger en tienda'}

Puedes ver el estado de tu pedido en tu cuenta.

Saludos,
El equipo de CEX Freted
  `;

  return sendEmail({ to: userEmail, subject, html, text });
}

/**
 * Email de recuperación de contraseña
 */
export async function sendPasswordResetEmail(userEmail, resetToken) {
  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

  const subject = 'Recuperación de contraseña - CEX Freted';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Recuperación de Contraseña</h1>
          </div>
          <div class="content">
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>

            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

            <div style="text-align: center;">
              <a href="${resetLink}" class="button">
                Restablecer contraseña
              </a>
            </div>

            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #0070f3;">${resetLink}</p>

            <div class="warning">
              <strong>⚠ Importante:</strong> Este enlace expirará en 1 hora por seguridad.
            </div>

            <p>Si no solicitaste este cambio, ignora este correo y tu contraseña no será modificada.</p>

            <p>Saludos,<br><strong>El equipo de CEX Freted</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CEX Freted. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Recuperación de Contraseña - CEX Freted

Hemos recibido una solicitud para restablecer tu contraseña.

Visita el siguiente enlace para crear una nueva contraseña:
${resetLink}

⚠ Este enlace expirará en 1 hora por seguridad.

Si no solicitaste este cambio, ignora este correo y tu contraseña no será modificada.

Saludos,
El equipo de CEX Freted
  `;

  return sendEmail({ to: userEmail, subject, html, text });
}
