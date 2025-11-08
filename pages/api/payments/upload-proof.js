import { getSession } from 'next-auth/react';
import { apiResponse } from '../../../lib/utils/apiResponse';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Configuración de Next.js para deshabilitar el bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Endpoint para subir comprobante de pago
 * POST /api/payments/upload-proof
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method Not Allowed'));
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json(apiResponse(null, 'No autorizado'));
  }

  try {
    // Configurar formidable para procesar el archivo
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payment-proofs');

    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: function ({ mimetype }) {
        // Solo permitir PDFs e imágenes
        return mimetype === 'application/pdf' || mimetype?.startsWith('image/');
      },
    });

    // Parsear el formulario
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const paymentId = Array.isArray(fields.paymentId) ? fields.paymentId[0] : fields.paymentId;
    const file = files.file?.[0] || files.file;

    if (!paymentId || !file) {
      return res.status(400).json(apiResponse(null, 'Datos incompletos'));
    }

    // Verificar que el pago pertenece al usuario
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json(apiResponse(null, 'Pago no encontrado'));
    }

    if (payment.order.userId !== session.user.id) {
      return res.status(403).json(apiResponse(null, 'No tienes permiso para realizar esta acción'));
    }

    // Renombrar archivo con formato: paymentId_timestamp.ext
    const fileExt = path.extname(file.originalFilename || file.newFilename);
    const newFileName = `${paymentId}_${Date.now()}${fileExt}`;
    const newPath = path.join(uploadDir, newFileName);

    // Mover archivo al nuevo nombre
    fs.renameSync(file.filepath, newPath);

    // Ruta relativa para guardar en BD
    const relativePath = `/uploads/payment-proofs/${newFileName}`;

    // Actualizar pago con la ruta del comprobante
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentProof: relativePath,
        paymentProofUploadedAt: new Date(),
        status: 'PROCESSING', // Cambiar estado a "en verificación"
      },
      include: {
        order: true,
      },
    });

    // También actualizar el historial de tracking de la orden
    const order = updatedPayment.order;
    const trackingHistory = order.trackingHistory ? JSON.parse(JSON.stringify(order.trackingHistory)) : [];

    trackingHistory.push({
      status: 'PAYMENT_VERIFICATION',
      timestamp: new Date().toISOString(),
      note: 'Comprobante de pago subido por el cliente',
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        trackingStatus: 'PAYMENT_VERIFICATION',
        trackingHistory,
      },
    });

    return res.status(200).json(
      apiResponse(
        {
          payment: updatedPayment,
          proofUrl: relativePath,
        },
        'Comprobante de pago subido correctamente'
      )
    );
  } catch (error) {
    console.error('Error al subir comprobante:', error);

    // Si el error es por tipo de archivo no permitido
    if (error.message?.includes('filter')) {
      return res.status(400).json(apiResponse(null, 'Solo se permiten archivos PDF o imágenes'));
    }

    return res.status(500).json(apiResponse(null, 'Error al subir comprobante de pago'));
  }
}
