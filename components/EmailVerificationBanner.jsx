import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function EmailVerificationBanner() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dismissed, setDismissed] = useState(false);

  // No mostrar si no hay sesión, si el email ya está verificado, o si fue descartado
  if (!session || session.user?.emailVerified || dismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Email de verificación enviado correctamente. Revisa tu bandeja de entrada.');
      } else {
        setMessage(data.error || 'Error al enviar el email');
      }
    } catch (error) {
      setMessage('Error al enviar el email de verificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            Tu correo electrónico no ha sido verificado. Por favor verifica tu correo para acceder
            a todas las funcionalidades.
          </p>
          {message && (
            <p
              className={`text-sm mt-2 ${
                message.includes('Error') ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {message}
            </p>
          )}
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleResendEmail}
              disabled={loading}
              className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Reenviar email de verificación'}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-sm font-medium text-yellow-700 hover:text-yellow-600"
            >
              Descartar
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 ml-3">
          <button
            onClick={() => setDismissed(true)}
            className="inline-flex text-yellow-400 hover:text-yellow-600"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
