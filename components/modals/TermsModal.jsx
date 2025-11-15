import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, FileText, CheckCircle } from 'lucide-react';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <FileText size={24} className="modal-icon" aria-hidden="true" />
            <h2 id="modal-title">Términos y Condiciones</h2>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="terms-section">
            <h3>1. Aceptación de los Términos</h3>
            <p>
              Al registrarte y usar los servicios de Sociedad Tecnológica Integral (canfret.com),
              aceptas estos términos y condiciones en su totalidad. Si no estás de acuerdo,
              por favor no utilices nuestros servicios.
            </p>
          </div>

          <div className="terms-section">
            <h3>2. Uso de la Plataforma</h3>
            <p>
              Nuestra plataforma conecta compradores y vendedores de equipos tecnológicos.
              Nos comprometemos a:
            </p>
            <ul>
              <li>Facilitar transacciones seguras entre compradores y vendedores</li>
              <li>Verificar cada pago antes de liberar pedidos</li>
              <li>Proporcionar soporte durante todo el proceso de compra</li>
              <li>Proteger tu información personal según nuestra política de privacidad</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>3. Proceso de Pago</h3>
            <p>
              Los pagos se realizan directamente al vendedor. Nuestro equipo de soporte:
            </p>
            <ul>
              <li>Te contactará para proporcionarte los datos de pago oficiales</li>
              <li>Validará tu depósito con el vendedor antes de liberar el pedido</li>
              <li>Te acompañará durante todo el proceso de pago</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>4. Privacidad y Protección de Datos</h3>
            <p>
              Tu privacidad es importante para nosotros. Nos comprometemos a:
            </p>
            <ul>
              <li>Proteger tu información personal</li>
              <li>No compartir tus datos con terceros sin tu consentimiento</li>
              <li>Usar tus datos solo para procesar tus pedidos y mejorar nuestros servicios</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>5. Responsabilidades del Usuario</h3>
            <p>
              Como usuario, te comprometes a:
            </p>
            <ul>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Mantener la confidencialidad de tu cuenta</li>
              <li>Usar la plataforma de manera responsable y legal</li>
              <li>Notificar cualquier uso no autorizado de tu cuenta</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>6. Garantías y Devoluciones</h3>
            <p>
              Todos los productos vendidos en nuestra plataforma cuentan con garantía.
              Consulta nuestra página de{' '}
              <Link href="/garantias" target="_blank">
                garantías
              </Link>{' '}
              para más información sobre políticas de devolución.
            </p>
          </div>

          <div className="terms-section">
            <h3>7. Modificaciones</h3>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento.
              Los cambios entrarán en vigor inmediatamente después de su publicación.
            </p>
          </div>

          <div className="terms-notice">
            <p>
              Para más información, consulta nuestros{' '}
              <Link href="/content/terminos-y-condiciones" target="_blank">
                términos completos
              </Link>{' '}
              o contacta a nuestro{' '}
              <Link href="/soporte" target="_blank">
                equipo de soporte
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="button-secondary"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="button-primary"
            onClick={() => {
              onAccept();
              onClose();
            }}
            type="button"
          >
            <CheckCircle size={18} />
            Acepto los Términos
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-container {
          background: #fff;
          border-radius: 24px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
          animation: slideUp 0.3s ease-out;
          outline: none;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          flex-shrink: 0;
        }

        .modal-title-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
        }

        .modal-close {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: none;
          background: rgba(15, 23, 42, 0.05);
          color: rgba(15, 23, 42, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .modal-close:hover {
          background: rgba(15, 23, 42, 0.1);
          color: #0f172a;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .terms-section {
          margin-bottom: 28px;
        }

        .terms-section h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px;
        }

        .terms-section p {
          margin: 0 0 12px;
          line-height: 1.7;
          color: rgba(15, 23, 42, 0.8);
          font-size: 0.95rem;
        }

        .terms-section ul {
          margin: 12px 0;
          padding-left: 24px;
        }

        .terms-section li {
          margin-bottom: 8px;
          line-height: 1.6;
          color: rgba(15, 23, 42, 0.75);
          font-size: 0.95rem;
        }

        .terms-section :global(a) {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .terms-section :global(a):hover {
          text-decoration: underline;
        }

        .terms-notice {
          background: linear-gradient(135deg, #eff6ff, #e0f2fe);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 16px;
          padding: 20px;
          margin-top: 24px;
        }

        .terms-notice p {
          margin: 0;
          font-size: 0.95rem;
          color: rgba(15, 23, 42, 0.8);
          line-height: 1.7;
        }

        .terms-notice :global(a) {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .terms-notice :global(a):hover {
          text-decoration: underline;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 28px;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          flex-shrink: 0;
        }

        .button-secondary,
        .button-primary {
          flex: 1;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .button-secondary {
          background: #fff;
          color: rgba(15, 23, 42, 0.7);
          border: 2px solid rgba(15, 23, 42, 0.12);
        }

        .button-secondary:hover {
          background: rgba(15, 23, 42, 0.04);
          border-color: rgba(15, 23, 42, 0.2);
        }

        .button-primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
        }

        @media (max-width: 768px) {
          .modal-container {
            max-height: 85vh;
            border-radius: 20px;
          }

          .modal-header {
            padding: 20px;
          }

          .modal-header h2 {
            font-size: 1.25rem;
          }

          .modal-content {
            padding: 20px;
          }

          .modal-footer {
            flex-direction: column;
            padding: 16px 20px;
          }

          .button-secondary,
          .button-primary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TermsModal;
