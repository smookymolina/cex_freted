import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Eye, X } from 'lucide-react';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export default function PaymentProofUploader({ payment, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(payment?.paymentProof || null);
  const fileInputRef = useRef(null);

  const handleOpenDialog = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error('Solo se permiten archivos PDF o im\u00e1genes (JPG, PNG).');
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new Error('El archivo debe ser menor a 10MB.');
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setSuccess(false);
      validateFile(file);
    } catch (validationError) {
      setError(validationError.message);
      event.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('paymentId', payment.id);

      const response = await fetch('/api/payments/upload-proof', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al subir el archivo');
      }

      setPreviewUrl(data.data.proofUrl);
      setSuccess(true);

      if (typeof onUploadSuccess === 'function') {
        onUploadSuccess(data.data);
      }
    } catch (err) {
      console.error('Error uploading proof:', err);
      setError(err.message || 'No pudimos subir el comprobante. Int\u00e9ntalo nuevamente.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderCard = () => {
    if (payment?.paymentProofVerified) {
      return (
        <div className="proof-card proof-card--success">
          <div className="proof-card__status">
            <span className="proof-badge proof-badge--success">Validado</span>
            <p className="proof-status-text">Tu comprobante fue revisado exitosamente.</p>
          </div>
          <div className="proof-card__content">
            <div>
              <h4>Pago confirmado</h4>
              <p>Gracias por cargar la evidencia. Continuaremos con la liberaci\u00f3n y seguimiento de tu pedido.</p>
            </div>
            {previewUrl && (
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="proof-link">
                <Eye size={16} />
                Ver comprobante
              </a>
            )}
          </div>
        </div>
      );
    }

    if (payment?.paymentProof && !payment?.paymentProofVerified) {
      return (
        <div className="proof-card proof-card--info">
          <div className="proof-card__status">
            <span className="proof-badge proof-badge--info">En revisi\u00f3n</span>
            <p className="proof-status-text">Nuestro equipo est\u00e1 validando tu pago.</p>
          </div>
          <div className="proof-card__content proof-card__content--columns">
            <div>
              <h4>Estamos validando tu pago</h4>
              <p>Recibir\u00e1s un correo y una notificaci\u00f3n en cuanto terminemos la verificaci\u00f3n.</p>
              <div className="proof-card__actions">
                <a
                  href={previewUrl || payment.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proof-link"
                >
                  <Eye size={16} />
                  Ver comprobante
                </a>
                <button type="button" onClick={handleOpenDialog} className="proof-link proof-link--button">
                  <Upload size={16} />
                  Reemplazar archivo
                </button>
              </div>
            </div>
            <div className="proof-meta">
              <p className="proof-meta__label">Tiempo estimado</p>
              <p className="proof-meta__value">De 15 a 30 min h\u00e1biles</p>
              <p className="proof-meta__helper">
                Si necesitas acelerar la validaci\u00f3n, contacta a soporte con tu n\u00famero de orden.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="proof-card proof-card--upload" role="group" aria-label="Subir comprobante de pago">
        <div className="proof-card__head">
          <div className="proof-badge-wrapper">
            <span className="proof-badge proof-badge--required">
              <AlertCircle size={14} />
              Requerido
            </span>
          </div>
          <h4 className="proof-card__title">Comprobante de pago</h4>
          <p className="proof-card__subtitle">
            Adjunta tu recibo bancario, captura o PDF para que podamos liberar tu pedido cuanto antes.
          </p>
        </div>

        <div className="proof-upload-container">
          <div
            className="proof-dropzone"
            role="button"
            tabIndex={0}
            onClick={handleOpenDialog}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOpenDialog();
              }
            }}
          >
            <div className="proof-dropzone__content">
              <div className="proof-dropzone__icon">
                <Upload size={32} strokeWidth={2.5} />
              </div>
              <div className="proof-dropzone__text">
                <p className="proof-dropzone__title">
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="proof-dropzone__subtitle">
                  o haz clic para seleccionar desde tu dispositivo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleOpenDialog();
              }}
              disabled={uploading}
              className="proof-upload-button"
            >
              {uploading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  <span>Subiendo archivo...</span>
                </>
              ) : (
                <>
                  <FileText size={20} />
                  <span>Seleccionar archivo</span>
                </>
              )}
            </button>
            <div className="proof-formats">
              <span className="proof-formats__item">
                <FileText size={14} />
                PDF
              </span>
              <span className="proof-formats__divider">•</span>
              <span className="proof-formats__item">
                <FileText size={14} />
                JPG
              </span>
              <span className="proof-formats__divider">•</span>
              <span className="proof-formats__item">
                <FileText size={14} />
                PNG
              </span>
              <span className="proof-formats__divider">•</span>
              <span className="proof-formats__max">Máximo 10 MB</span>
            </div>
          </div>

          <div className="proof-guidelines">
            <div className="proof-guidelines__header">
              <CheckCircle2 size={18} />
              <h5>Recomendaciones importantes</h5>
            </div>
            <ul className="proof-guidelines__list">
              <li className="proof-guidelines__item">
                <span className="proof-guidelines__bullet">✓</span>
                <span>Debe verse el monto, banco y fecha de operación</span>
              </li>
              <li className="proof-guidelines__item">
                <span className="proof-guidelines__bullet">✓</span>
                <span>Asegúrate de que la imagen o PDF sea legible</span>
              </li>
              <li className="proof-guidelines__item">
                <span className="proof-guidelines__bullet">✓</span>
                <span>Solo archivos emitidos por tu banco oficial</span>
              </li>
            </ul>
            <div className="proof-tip">
              <div className="proof-tip__icon">💡</div>
              <div className="proof-tip__content">
                <p className="proof-tip__title">Consejo útil</p>
                <p className="proof-tip__text">
                  Puedes subir nuevas versiones si el comprobante cambia o necesitas actualizarlo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="proof-wrapper">
      {renderCard()}

      {error && (
        <div className="proof-alert proof-alert--error">
          <div className="proof-alert__icon">
            <AlertCircle size={18} />
          </div>
          <div className="proof-alert__body">
            <p>{error}</p>
            <button type="button" onClick={() => setError(null)} aria-label="Cerrar alerta">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {success && !payment?.paymentProofVerified && (
        <div className="proof-alert proof-alert--success">
          <div className="proof-alert__icon">
            <CheckCircle2 size={18} />
          </div>
          <div className="proof-alert__body">
            <p>Comprobante recibido. Nuestro equipo lo revisar\u00e1 en breve.</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <style jsx>{`
        .proof-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .proof-card {
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: white;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06), 0 8px 16px rgba(15, 23, 42, 0.04);
        }

        .proof-card--success {
          border-color: rgba(16, 185, 129, 0.35);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02));
        }

        .proof-card--info {
          border-color: rgba(37, 99, 235, 0.3);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.06), rgba(59, 130, 246, 0.02));
        }

        .proof-card--upload {
          border: 2px solid rgba(59, 130, 246, 0.2);
          background: linear-gradient(135deg, #ffffff 0%, rgba(248, 250, 252, 0.95) 100%);
        }

        .proof-card__status {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .proof-status-text {
          margin: 0;
          font-size: 14px;
          color: rgba(15, 23, 42, 0.7);
          flex: 1;
        }

        .proof-card__content {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          gap: 16px;
        }

        .proof-card__content h4 {
          margin: 0 0 6px 0;
          font-size: 18px;
          color: #0f172a;
        }

        .proof-card__content p {
          margin: 0;
          color: rgba(15, 23, 42, 0.75);
          font-size: 14px;
          line-height: 1.45;
        }

        .proof-card__content--columns {
          flex-direction: column;
        }

        .proof-card__head {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .proof-badge-wrapper {
          display: flex;
          align-items: center;
        }

        .proof-badge--required {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1));
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .proof-card__title {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
        }

        .proof-card__subtitle {
          margin: 0;
          color: rgba(15, 23, 42, 0.65);
          font-size: 15px;
          line-height: 1.6;
          max-width: 600px;
        }

        .proof-card__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-top: 12px;
        }

        .proof-upload-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }

        .proof-dropzone {
          border: 2px dashed rgba(37, 99, 235, 0.3);
          border-radius: 20px;
          padding: 40px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.5), rgba(255, 255, 255, 0.8));
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .proof-dropzone::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.08));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .proof-dropzone:hover {
          border-color: #2563eb;
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.15);
        }

        .proof-dropzone:hover::before {
          opacity: 1;
        }

        .proof-dropzone:focus-visible {
          outline: 3px solid rgba(37, 99, 235, 0.5);
          outline-offset: 4px;
        }

        .proof-dropzone__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .proof-dropzone__icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
          transition: transform 0.3s ease;
        }

        .proof-dropzone:hover .proof-dropzone__icon {
          transform: scale(1.1);
        }

        .proof-dropzone__text {
          text-align: center;
        }

        .proof-dropzone__title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .proof-dropzone__subtitle {
          margin: 0;
          font-size: 14px;
          color: rgba(15, 23, 42, 0.6);
        }

        .proof-upload-button {
          border: none;
          border-radius: 14px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          font-weight: 600;
          font-size: 15px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
          position: relative;
          z-index: 1;
        }

        .proof-upload-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .proof-upload-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        }

        .proof-upload-button:not(:disabled):active {
          transform: translateY(0);
        }

        .proof-formats {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          padding: 12px 20px;
          border-radius: 12px;
          background: rgba(248, 250, 252, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          font-size: 13px;
          position: relative;
          z-index: 1;
        }

        .proof-formats__item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #475569;
          font-weight: 600;
        }

        .proof-formats__divider {
          color: rgba(148, 163, 184, 0.4);
          font-weight: 300;
        }

        .proof-formats__max {
          color: #64748b;
          font-weight: 500;
        }

        .proof-guidelines {
          border-radius: 20px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background: white;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .proof-guidelines__header {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0ea5e9;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(14, 165, 233, 0.15);
        }

        .proof-guidelines__header h5 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .proof-guidelines__list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .proof-guidelines__item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: rgba(15, 23, 42, 0.75);
          line-height: 1.5;
        }

        .proof-guidelines__bullet {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1));
          color: #059669;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .proof-tip {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(245, 158, 11, 0.05));
          border: 1px solid rgba(251, 191, 36, 0.25);
        }

        .proof-tip__icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .proof-tip__content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .proof-tip__title {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
        }

        .proof-tip__text {
          margin: 0;
          font-size: 13px;
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.5;
        }

        .proof-link {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          font-weight: 600;
          color: #1d4ed8;
        }

        .proof-link--button {
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 999px;
          padding: 6px 14px;
        }

        .proof-button {
          border: none;
          border-radius: 12px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .proof-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .proof-button:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 20px rgba(37, 99, 235, 0.25);
        }

        .proof-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: rgba(37, 99, 235, 0.1);
          color: #1d4ed8;
        }

        .proof-badge--success {
          background: rgba(16, 185, 129, 0.15);
          color: #047857;
        }

        .proof-badge--info {
          background: rgba(59, 130, 246, 0.15);
          color: #1d4ed8;
        }

        .proof-meta {
          border-radius: 16px;
          border: 1px solid rgba(37, 99, 235, 0.15);
          padding: 16px 18px;
          background: rgba(248, 250, 252, 0.8);
        }

        .proof-meta--soft {
          border-style: dashed;
          border-color: rgba(37, 99, 235, 0.25);
          background: rgba(59, 130, 246, 0.05);
        }

        .proof-meta__label {
          margin: 0;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(15, 23, 42, 0.6);
        }

        .proof-meta__value {
          margin: 4px 0 0;
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
        }

        .proof-meta__helper {
          margin: 6px 0 0;
          font-size: 13px;
          color: rgba(15, 23, 42, 0.65);
        }
        .proof-alert {
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          border: 1px solid transparent;
        }

        .proof-alert--error {
          background: rgba(248, 113, 113, 0.12);
          border-color: rgba(248, 113, 113, 0.4);
          color: #b91c1c;
        }

        .proof-alert--success {
          background: rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.4);
          color: #047857;
        }

        .proof-alert__icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .proof-alert__body {
          flex: 1;
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
        }

        .proof-alert__body p {
          margin: 0;
          font-size: 14px;
        }

        .proof-alert__body button {
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 968px) {
          .proof-upload-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .proof-card {
            padding: 24px;
          }

          .proof-dropzone {
            padding: 32px 20px;
          }
        }

        @media (max-width: 640px) {
          .proof-card__content {
            flex-direction: column;
          }

          .proof-card {
            padding: 20px;
          }

          .proof-card__title {
            font-size: 20px;
          }

          .proof-dropzone {
            padding: 24px 16px;
          }

          .proof-dropzone__icon {
            width: 64px;
            height: 64px;
          }

          .proof-upload-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
