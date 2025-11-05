import { sendEmail } from '../../lib/email/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, email, phone, reason, message, acceptsTerms } = req.body;

  // Validaciones
  if (!name || !email || !reason || !message || !acceptsTerms) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  try {
    // Email al equipo de soporte
    const subject = `[Contacto] ${reason} - ${name}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0070f3; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 15px 0; padding: 10px; background-color: white; border-radius: 6px; }
            .label { font-weight: bold; color: #666; }
            .value { color: #1a1a1a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nuevo mensaje de contacto</h2>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">Nombre:</span>
                <span class="value">${name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              ${phone ? `
              <div class="info-row">
                <span class="label">Teléfono:</span>
                <span class="value">${phone}</span>
              </div>
              ` : ''}
              <div class="info-row">
                <span class="label">Motivo:</span>
                <span class="value">${reason}</span>
              </div>
              <div class="info-row">
                <span class="label">Mensaje:</span>
                <div class="value" style="white-space: pre-wrap; margin-top: 10px;">${message}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Nuevo mensaje de contacto

Nombre: ${name}
Email: ${email}
${phone ? `Teléfono: ${phone}` : ''}
Motivo: ${reason}

Mensaje:
${message}
    `;

    // Enviar email al equipo de soporte
    const result = await sendEmail({
      to: process.env.EMAIL_FROM || 'soporte@cexfreted.com',
      subject,
      html,
      text,
    });

    // Email de confirmación al usuario
    const confirmationSubject = 'Hemos recibido tu mensaje - CEX Freted';
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Mensaje recibido</h1>
            </div>
            <div class="content">
              <p>Hola ${name},</p>
              <p>Hemos recibido tu mensaje y nuestro equipo lo está revisando.</p>
              <p><strong>Motivo:</strong> ${reason}</p>
              <p>Te responderemos en menos de 24 horas a <strong>${email}</strong></p>
              <p>Gracias por contactarnos.</p>
              <p>Saludos,<br><strong>El equipo de CEX Freted</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const confirmationText = `
Hola ${name},

Hemos recibido tu mensaje y nuestro equipo lo está revisando.

Motivo: ${reason}

Te responderemos en menos de 24 horas a ${email}

Gracias por contactarnos.

Saludos,
El equipo de CEX Freted
    `;

    // Enviar confirmación al usuario
    await sendEmail({
      to: email,
      subject: confirmationSubject,
      html: confirmationHtml,
      text: confirmationText,
    });

    return res.status(200).json({
      success: true,
      message: 'Mensaje enviado correctamente',
    });
  } catch (error) {
    console.error('Error en contacto:', error);
    return res.status(500).json({
      message: 'Error al enviar el mensaje',
    });
  }
}
