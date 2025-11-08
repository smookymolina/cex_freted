import { getSession } from 'next-auth/react';
import { apiResponse } from '../../../../lib/utils/apiResponse';
import PaymentService from '../../../../services/paymentService';

const VALID_RELEASE_STATUSES = [
  'WAITING_SUPPORT',
  'CALL_SCHEDULED',
  'RELEASED_TO_CUSTOMER',
  'ON_HOLD',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json(apiResponse(null, 'Method Not Allowed'));
  }

  const session = await getSession({ req });

  if (!session || session.user.role !== 'SOPORTE') {
    return res.status(403).json(apiResponse(null, 'Forbidden'));
  }

  const { orderId, releaseStatus, notes } = req.body || {};

  if (!orderId || !releaseStatus) {
    return res.status(400).json(apiResponse(null, 'Datos incompletos'));
  }

  if (!VALID_RELEASE_STATUSES.includes(releaseStatus)) {
    return res
      .status(400)
      .json(apiResponse(null, `Estado invalido. Usa alguno de: ${VALID_RELEASE_STATUSES.join(', ')}`));
  }

  const result = await PaymentService.updatePaymentRelease(orderId, releaseStatus, {
    notes,
    supportUserId: session.user.email || session.user.id,
  });

  if (!result.success) {
    return res.status(500).json(apiResponse(null, result.error || 'No se pudo actualizar la liberacion'));
  }

  return res.status(200).json(
    apiResponse(
      {
        order: result.order,
        releaseStatus: result.order.paymentReleaseStatus,
      },
      'Estado de liberacion actualizado'
    )
  );
}
