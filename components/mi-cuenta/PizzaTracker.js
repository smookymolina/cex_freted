import { CheckCircle2, Clock, Package, Truck, Home, Circle } from 'lucide-react';

const STAGES = [
  {
    key: 'ORDER_RECEIVED',
    label: 'Pedido recibido',
    description: 'Tu pedido ha sido registrado',
    icon: CheckCircle2,
  },
  {
    key: 'PAYMENT_VERIFICATION',
    label: 'Verificación de pago',
    description: 'Estamos verificando tu pago',
    icon: Clock,
  },
  {
    key: 'PREPARING_ORDER',
    label: 'Preparando pedido',
    description: 'Estamos preparando tus productos',
    icon: Package,
  },
  {
    key: 'IN_TRANSIT',
    label: 'En camino',
    description: 'Tu pedido está en tránsito',
    icon: Truck,
  },
  {
    key: 'DELIVERED',
    label: 'Entregado',
    description: 'Tu pedido ha llegado a destino',
    icon: Home,
  },
];

const normalizeHistory = (history) => {
  if (!history) return [];
  if (Array.isArray(history)) return history;

  if (typeof history === 'string') {
    try {
      const parsed = JSON.parse(history);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('No se pudo parsear trackingHistory', error);
      return [];
    }
  }

  if (Array.isArray(history?.records)) return history.records;
  if (Array.isArray(history?.history)) return history.history;

  return [];
};

const formatDate = (date) => {
  if (!date) return null;
  try {
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return null;
  }
};

export default function PizzaTracker({ trackingStatus, trackingHistory, createdAt }) {
  const historyRecords = normalizeHistory(trackingHistory);
  const stageIndexRaw = STAGES.findIndex((stage) => stage.key === trackingStatus);
  const currentStageIndex = stageIndexRaw >= 0 ? stageIndexRaw : 0;
  const currentStage = STAGES[currentStageIndex] || STAGES[0];

  const progressPercent =
    STAGES.length > 1 ? Math.min(100, Math.max(0, (currentStageIndex / (STAGES.length - 1)) * 100)) : 0;

  const statusBadgeTone = currentStage.key === 'DELIVERED' ? 'success' : 'info';
  const statusBadgeLabel = currentStage.key === 'DELIVERED' ? 'Completado' : 'En progreso';

  const getStageStatus = (index) => {
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'pending';
  };

  const getStageTimestamp = (stageKey) => {
    if (stageKey === 'ORDER_RECEIVED' && createdAt) {
      return new Date(createdAt);
    }
    const record = historyRecords.find((entry) => entry.status === stageKey);
    if (record?.timestamp) {
      return new Date(record.timestamp);
    }
    return null;
  };

  return (
    <div className="tracker-card">
      <div className="tracker-head">
        <div>
          <p className="tracker-head__eyebrow">Seguimiento del pedido</p>
          <h5 className="tracker-head__title">{currentStage.label}</h5>
          <p className="tracker-head__subtitle">{currentStage.description}</p>
        </div>
        <span className={`status-chip status-chip--${statusBadgeTone}`}>{statusBadgeLabel}</span>
      </div>

      <div className="tracker-progress">
        <div className="tracker-progress__meter" aria-hidden="true">
          <span className="tracker-progress__fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="tracker-steps">
          {STAGES.map((stage, index) => {
            const status = getStageStatus(index);
            const StageIcon = stage.icon;
            const timestamp = getStageTimestamp(stage.key);

            return (
              <div key={stage.key} className={`tracker-step tracker-step--${status}`}>
                <div className="tracker-step__icon">
                  <StageIcon size={20} />
                </div>

                <div className="tracker-step__content">
                  <div className="tracker-step__header">
                    <p className="tracker-step__label">{stage.label}</p>
                    {status === 'current' && <span className="tracker-step__badge">Actual</span>}
                    {status === 'completed' && <span className="tracker-step__badge tracker-step__badge--muted">Listo</span>}
                  </div>
                  <p className="tracker-step__description">{stage.description}</p>
                  {timestamp && <span className="tracker-step__timestamp">{formatDate(timestamp)}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {historyRecords.length > 0 && (
        <div className="tracker-history">
          <p className="tracker-history__title">Movimientos recientes</p>
          <div className="tracker-history__list">
            {[...historyRecords]
              .sort((a, b) => {
                const dateA = a?.timestamp ? new Date(a.timestamp).getTime() : 0;
                const dateB = b?.timestamp ? new Date(b.timestamp).getTime() : 0;
                return dateB - dateA;
              })
              .map((record, index) => {
                const stage = STAGES.find((item) => item.key === record.status);
                const timestamp = record?.timestamp ? new Date(record.timestamp) : null;
                const StageIcon = stage?.icon || Circle;

                return (
                  <div key={`${record.status}-${index}`} className="history-item">
                    <div className="history-item__icon">
                      <StageIcon size={16} />
                    </div>
                    <div className="history-item__body">
                      <p className="history-item__label">{stage?.label || record.status}</p>
                      {record?.note && <p className="history-item__note">{record.note}</p>}
                    </div>
                    {timestamp && <span className="history-item__time">{formatDate(timestamp)}</span>}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <style jsx>{`
        .tracker-card {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .tracker-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .tracker-head__eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 11px;
          font-weight: 700;
          color: rgba(15, 23, 42, 0.55);
          margin: 0 0 4px 0;
        }

        .tracker-head__title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
        }

        .tracker-head__subtitle {
          margin: 6px 0 0;
          font-size: 14px;
          color: rgba(15, 23, 42, 0.7);
        }

        .status-chip {
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          align-self: flex-start;
        }

        .status-chip--info {
          background: rgba(59, 130, 246, 0.12);
          color: #1d4ed8;
        }

        .status-chip--success {
          background: rgba(34, 197, 94, 0.12);
          color: #15803d;
        }

        .tracker-progress {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .tracker-progress__meter {
          position: relative;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.25);
          overflow: hidden;
        }

        .tracker-progress__fill {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%);
          transition: width 0.4s ease;
        }

        .tracker-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .tracker-step {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          background: white;
          position: relative;
          min-height: 120px;
        }

        .tracker-step__icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          background: rgba(148, 163, 184, 0.15);
          flex-shrink: 0;
        }

        .tracker-step--completed {
          border-color: rgba(34, 197, 94, 0.35);
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(16, 185, 129, 0.12));
        }

        .tracker-step--completed .tracker-step__icon {
          background: rgba(34, 197, 94, 0.2);
          color: #15803d;
        }

        .tracker-step--current {
          border-color: rgba(37, 99, 235, 0.4);
          box-shadow: 0 20px 35px rgba(37, 99, 235, 0.15);
        }

        .tracker-step--current .tracker-step__icon {
          background: rgba(37, 99, 235, 0.18);
          color: #1d4ed8;
        }

        .tracker-step__content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tracker-step__header {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .tracker-step__label {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
        }

        .tracker-step__badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(37, 99, 235, 0.12);
          color: #1d4ed8;
        }

        .tracker-step__badge--muted {
          background: rgba(15, 118, 110, 0.12);
          color: #0f766e;
        }

        .tracker-step__description {
          margin: 0;
          font-size: 13px;
          color: rgba(15, 23, 42, 0.7);
        }

        .tracker-step__timestamp {
          font-size: 12px;
          font-weight: 600;
          color: rgba(15, 23, 42, 0.6);
        }

        .tracker-history {
          padding: 16px;
          border-radius: 16px;
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .tracker-history__title {
          margin: 0 0 12px 0;
          font-weight: 600;
          color: #0f172a;
          font-size: 15px;
        }

        .tracker-history__list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .history-item__icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.12);
          color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .history-item__body {
          flex: 1;
        }

        .history-item__label {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .history-item__note {
          margin: 2px 0 0;
          font-size: 12px;
          color: rgba(15, 23, 42, 0.65);
        }

        .history-item__time {
          font-size: 12px;
          color: rgba(15, 23, 42, 0.55);
          white-space: nowrap;
          font-weight: 500;
        }

        @media (max-width: 720px) {
          .tracker-head {
            flex-direction: column;
          }

          .status-chip {
            align-self: flex-start;
          }

          .tracker-steps {
            grid-template-columns: 1fr;
          }

          .history-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .history-item__time {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
