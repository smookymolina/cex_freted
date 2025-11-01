import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AccountLayout from '../../components/mi-cuenta/AccountLayout';
import { Edit2, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

const ProfilePage = ({ user }) => {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (router.query.verified === 'true') {
      setFeedback({ type: 'success', message: '¡Email verificado exitosamente!' });
      const timeoutId = setTimeout(() => {
        setFeedback(null);
        router.replace('/mi-cuenta/perfil', undefined, { shallow: true });
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [router]);

  const formatDate = (date) => {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleVerifyEmail = async () => {
    setVerifying(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar verificación');
      }

      setFeedback({ type: 'success', message: data.message || 'Verificación enviada con éxito.' });

      if (data.verificationLink) {
        window.open(data.verificationLink, '_blank');
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Error al enviar verificación' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AccountLayout title="Mi Perfil">
      <div className="profile-container">
        {feedback && (
          <div
            className={`feedback-banner feedback-banner--${feedback.type}`}
            role="status"
            aria-live="polite"
          >
            {feedback.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="profile-grid">
          <section className="profile-section profile-section--highlight">
            <div className="section-header">
              <h3 className="section-title">Información personal</h3>
              <Link href="/mi-cuenta/editar-perfil" className="edit-button">
                <Edit2 size={16} aria-hidden="true" />
                Editar
              </Link>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Nombre completo</label>
                <p className="info-value">{user.name || 'No especificado'}</p>
              </div>

              <div className="info-item">
                <label className="info-label">
                  <Mail size={16} aria-hidden="true" />
                  Email
                </label>
                <p className="info-value">{user.email}</p>
              </div>

              <div className="info-item">
                <label className="info-label">
                  <Phone size={16} aria-hidden="true" />
                  Teléfono
                </label>
                <p className="info-value">{user.phone || 'No especificado'}</p>
              </div>

              <div className="info-item">
                <label className="info-label">
                  <Calendar size={16} aria-hidden="true" />
                  Miembro desde
                </label>
                <p className="info-value">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </section>

          <section className="profile-section profile-section--status">
            <h3 className="section-title">Estado de la cuenta</h3>

            <div className="status-column">
              <article className="status-card">
                <div className={`status-icon ${user.emailVerified ? 'status-icon--verified' : 'status-icon--pending'}`}>
                  {user.emailVerified ? <CheckCircle size={22} aria-hidden="true" /> : <XCircle size={22} aria-hidden="true" />}
                </div>
                <div className="status-content">
                  <h4 className="status-title">Email</h4>
                  <p className="status-description">
                    {user.emailVerified ? 'Verificado' : 'No verificado'}
                  </p>
                  {!user.emailVerified && (
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={verifying}
                      className="verify-button"
                    >
                      {verifying ? 'Enviando…' : 'Verificar ahora'}
                    </button>
                  )}
                </div>
              </article>

              <article className="status-card">
                <div className="status-icon status-icon--verified">
                  <CheckCircle size={22} aria-hidden="true" />
                </div>
                <div className="status-content">
                  <h4 className="status-title">Cuenta activa</h4>
                  <p className="status-description">Todo está funcionando correctamente.</p>
                </div>
              </article>
            </div>
          </section>
        </div>

        <section className="profile-section">
          <h3 className="section-title">Mis estadísticas</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Pedidos realizados</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Productos favoritos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Reviews escritas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">$0</div>
              <div className="stat-label">Total gastado</div>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h3 className="section-title">Acciones rápidas</h3>

          <div className="quick-actions">
            <Link href="/mi-cuenta/editar-perfil" className="action-button action-button--primary">
              Editar perfil
            </Link>
            <Link href="/mi-cuenta/configuracion" className="action-button">
              Configuración
            </Link>
            <Link href="/mi-cuenta/pedidos" className="action-button">
              Ver pedidos
            </Link>
            <Link href="/comprar" className="action-button">
              Seguir comprando
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .profile-container {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
          gap: 24px;
          align-items: stretch;
        }

        .profile-section {
          background: white;
          border-radius: 18px;
          padding: 28px 30px;
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.18);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-section--highlight {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%);
        }

        .profile-section--status {
          gap: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .edit-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background-color: rgba(59, 130, 246, 0.12);
          color: #1d4ed8;
          border-radius: 999px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .edit-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 16px rgba(59, 130, 246, 0.2);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 18px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 14px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          backdrop-filter: blur(6px);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .profile-section--highlight .info-item {
          background-color: rgba(255, 255, 255, 0.88);
        }

        .info-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.16);
        }

        .info-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(15, 23, 42, 0.6);
        }

        .info-value {
          font-size: 16px;
          color: #0f172a;
          font-weight: 600;
          margin: 0;
          word-break: break-word;
        }

        .status-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .status-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background-color: #f8fbff;
        }

        .status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background-color: rgba(148, 163, 184, 0.16);
          color: #0f172a;
          flex-shrink: 0;
        }

        .status-icon--verified {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
          color: #15803d;
        }

        .status-icon--pending {
          background: linear-gradient(135deg, rgba(248, 113, 113, 0.18) 0%, rgba(251, 191, 36, 0.22) 100%);
          color: #b91c1c;
        }

        .status-content {
          flex: 1;
        }

        .status-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px 0;
        }

        .status-description {
          font-size: 14px;
          color: rgba(15, 23, 42, 0.7);
          margin: 0 0 12px 0;
        }

        .verify-button {
          font-size: 13px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
          color: white;
          border: none;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .verify-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 20px rgba(37, 99, 235, 0.26);
        }

        .verify-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 16px;
        }

        .stat-card {
          text-align: center;
          padding: 24px 18px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(14, 165, 233, 0.12) 100%);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 24px rgba(37, 99, 235, 0.18);
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #1d4ed8;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 13px;
          color: rgba(15, 23, 42, 0.75);
          font-weight: 500;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }

        .action-button {
          padding: 14px 20px;
          text-align: center;
          border-radius: 14px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background-color: white;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 18px rgba(15, 23, 42, 0.16);
        }

        .action-button--primary {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          border: none;
          color: white;
        }

        .action-button--primary:hover {
          box-shadow: 0 14px 26px rgba(37, 99, 235, 0.28);
        }

        .feedback-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 18px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
        }

        .feedback-banner--success {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid rgba(22, 101, 52, 0.18);
        }

        .feedback-banner--error {
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid rgba(185, 28, 28, 0.18);
        }

        @media (max-width: 1080px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .profile-section {
            padding: 24px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 540px) {
          .profile-container {
            gap: 20px;
          }

          .profile-section {
            padding: 20px;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AccountLayout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/mi-cuenta/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
}

export default ProfilePage;
