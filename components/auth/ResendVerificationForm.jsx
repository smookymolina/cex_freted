import { useState } from 'react';

export default function ResendVerificationForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message,
        });
        setEmail('');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Error al enviar el email',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al procesar la solicitud',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-blue-600 hover:text-blue-500 underline"
        >
          ¿No recibiste el email de verificación?
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Reenviar email de verificación
        </h3>
        <button
          onClick={() => {
            setShowForm(false);
            setMessage(null);
            setEmail('');
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleResend} className="space-y-3">
        <div>
          <label htmlFor="resend-email" className="block text-sm text-gray-700">
            Ingresa tu email
          </label>
          <input
            id="resend-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="tu@email.com"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Reenviar email de verificación'}
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-500">
        Revisa tu bandeja de entrada y carpeta de spam. El email puede tardar unos minutos en llegar.
      </p>
    </div>
  );
}
