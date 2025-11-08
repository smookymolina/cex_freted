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
      throw new Error('Solo se permiten archivos PDF o imágenes (JPG, PNG).');
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
      setError(err.message || 'No pudimos subir el comprobante. Inténtalo nuevamente.');
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
          <div className="proof-card__icon" aria-hidden="true">
            <CheckCircle2 size={24} />
          </div>
          <div className="proof-card__body">
            <p className="proof-card__eyebrow">Comprobante verificado</p>
            <h4>Tu pago fue validado con éxito</h4>
            <p>Gracias por enviar la información, ya puedes continuar con el seguimiento del pedido.</p>
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
          <div className="proof-card__icon" aria-hidden="true">
            <Loader2 size={24} className="spin" />
          </div>
          <div className="proof-card__body">
            <p className="proof-card__eyebrow">Comprobante en revisión</p>
            <h4>Estamos validando tu pago</h4>
            <p>En cuanto confirmemos la información te enviaremos una notificación por correo electrónico.</p>
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
        </div>
      );
    }

    return (
      <div className="proof-card proof-card--upload" role="group" aria-label="Subir comprobante de pago">
        <div className="proof-card__icon" aria-hidden="true">
          <Upload size={26} />
        </div>
        <div className="proof-card__body">
          <p className="proof-card__eyebrow">Comprobante de pago</p>
          <h4>Sube tu comprobante</h4>
          <p>Adjunta tu recibo bancario, captura o PDF para acelerar la confirmación.</p>
          <div className="proof-card__actions">
            <button type="button" onClick={handleOpenDialog} disabled={uploading} className="proof-button">
              {uploading ? (
                <>
                  <Loader2 size={18} className="spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Seleccionar archivo
                </>
              )}
            </button>
            <p className="proof-card__hint">Formatos: PDF, JPG, PNG · Máximo 10MB</p>
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
            <p>¡Comprobante recibido! Nuestro equipo lo revisará en breve.</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={handleFileSelect}
      />

      <style jsx>{`
        .proof-wrapper {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .proof-card {
          border-radius: 18px;
          padding: 22px;
          display: flex;
          gap: 18px;
          align-items: flex-start;
          border: 1px solid rgba(148, 163, 184, 0.25);
          background: white;
        }

        .proof-card--success {
          border-color: rgba(16, 185, 129, 0.3);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.02));
        }

        .proof-card--info {
          border-color: rgba(37, 99, 235, 0.25);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.02));
        }

        .proof-card--upload {
          border: 1px dashed rgba(59, 130, 246, 0.4);
          background: rgba(248, 250, 252, 0.6);
        }

        .proof-card__icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(37, 99, 235, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1d4ed8;
          flex-shrink: 0;
        }

        .proof-card--success .proof-card__icon {
          background: rgba(16, 185, 129, 0.2);
          color: #059669;
        }

        .proof-card--info .proof-card__icon {
          background: rgba(59, 130, 246, 0.18);
          color: #1d4ed8;
        }

        .proof-card__body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .proof-card__eyebrow {
          margin: 0;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(15, 23, 42, 0.55);
        }

        .proof-card__body h4 {
          margin: 0;
          font-size: 18px;
          color: #0f172a;
        }

        .proof-card__body p {
          margin: 0;
          color: rgba(15, 23, 42, 0.75);
          font-size: 14px;
          line-height: 1.4;
        }

        .proof-card__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
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

        .proof-card__hint {
          font-size: 12px;
          color: rgba(15, 23, 42, 0.6);
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

        @media (max-width: 640px) {
          .proof-card {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}
