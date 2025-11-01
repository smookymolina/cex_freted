import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', resetLink: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '', resetLink: '' });

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar solicitud');
      }

      setMessage({
        type: 'success',
        text: data.message,
        resetLink: data.resetLink || '',
      });
      setEmail('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error al enviar email de recuperación',
        resetLink: '',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="card-header">
            <Mail size={48} className="icon" />
            <h1 className="title">¿Olvidaste tu contraseña?</h1>
            <p className="subtitle">
              Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña
            </p>
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <div>
                <span>{message.text}</span>
                {message.resetLink && (
                  <div className="reset-link-container">
                    <p className="dev-note">
                      (Modo desarrollo - En producción se enviará por email)
                    </p>
                    <a href={message.resetLink} className="reset-link">
                      Ir al enlace de recuperación
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="tu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Instrucciones'}
            </button>
          </form>

          <div className="footer">
            <Link href="/mi-cuenta/login" className="back-link">
              <ArrowLeft size={16} />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .forgot-password-container {
          width: 100%;
          max-width: 480px;
        }

        .forgot-password-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          padding: 48px;
        }

        .card-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .icon {
          color: #667eea;
          margin-bottom: 16px;
        }

        .title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 12px 0;
        }

        .subtitle {
          font-size: 15px;
          color: #666;
          margin: 0;
          line-height: 1.6;
        }

        .message {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .reset-link-container {
          margin-top: 12px;
        }

        .dev-note {
          font-size: 12px;
          color: #666;
          margin: 8px 0;
        }

        .reset-link {
          display: inline-block;
          padding: 8px 16px;
          background-color: #667eea;
          color: white;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .reset-link:hover {
          background-color: #5568d3;
        }

        .form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 15px;
          color: #1a1a1a;
          transition: all 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .submit-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footer {
          text-align: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .back-link:hover {
          color: #5568d3;
        }

        @media (max-width: 640px) {
          .forgot-password-card {
            padding: 32px 24px;
          }

          .title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
