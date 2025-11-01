import React, { useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import AccountLayout from '../../components/mi-cuenta/AccountLayout';
import {
  Bell,
  Lock,
  Globe,
  Eye,
  Trash2,
  Shield,
  Mail,
  Check,
  Smartphone,
  ShoppingBag,
  MessageCircle,
  XCircle,
} from 'lucide-react';

const notificationOptions = [
  {
    key: 'email',
    icon: Mail,
    title: 'Notificaciones por email',
    description: 'Recibe actualizaciones y comprobantes directamente en tu correo.',
  },
  {
    key: 'push',
    icon: Bell,
    title: 'Notificaciones push',
    description: 'Alertas instantáneas en tu dispositivo cuando algo importante ocurre.',
  },
  {
    key: 'sms',
    icon: Smartphone,
    title: 'SMS',
    description: 'Mensajes de texto para eventos críticos como entregas o cambios de seguridad.',
  },
  {
    key: 'marketing',
    icon: Check,
    title: 'Ofertas y promociones',
    description: 'Descuentos exclusivos sobre productos verificados y lanzamientos.',
  },
];

const privacyOptions = [
  {
    key: 'profilePublic',
    icon: Eye,
    title: 'Perfil público',
    description: 'Permite que otros usuarios puedan encontrar y seguir tu actividad.',
  },
  {
    key: 'showPurchases',
    icon: ShoppingBag,
    title: 'Mostrar compras',
    description: 'Comparte automáticamente tus compras recientes con tu comunidad.',
  },
  {
    key: 'allowMessages',
    icon: MessageCircle,
    title: 'Recibir mensajes directos',
    description: 'Habilita que otros usuarios te contacten para ofertas o soporte.',
  },
];

const languages = [
  { value: 'es-MX', label: 'Español (México)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'en-US', label: 'English (US)' },
];

const currencies = [
  { value: 'MXN', label: 'MXN - Peso Mexicano' },
  { value: 'USD', label: 'USD - Dólar Estadounidense' },
  { value: 'EUR', label: 'EUR - Euro' },
];

const ConfiguracionPage = ({ initialSettings }) => {
  const [notifications, setNotifications] = useState(
    initialSettings?.notifications || {
      email: true,
      push: false,
      sms: false,
      marketing: true,
    }
  );

  const [privacy, setPrivacy] = useState(
    initialSettings?.privacy || {
      profilePublic: false,
      showPurchases: false,
      allowMessages: true,
    }
  );

  const [language, setLanguage] = useState('es-MX');
  const [currency, setCurrency] = useState('MXN');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const saveSettings = async (newNotifications, newPrivacy) => {
    setSaving(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notifications: newNotifications,
          privacy: newPrivacy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar configuraciones');
      }

      setFeedback({ type: 'success', message: 'Configuración guardada correctamente.' });
      setTimeout(() => setFeedback(null), 3200);
    } catch (error) {
      console.error('Error al guardar:', error);
      setFeedback({ type: 'error', message: 'Error al guardar tus preferencias. Inténtalo nuevamente.' });
      setTimeout(() => setFeedback(null), 3600);
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationChange = async (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    await saveSettings(newNotifications, privacy);
  };

  const handlePrivacyChange = async (key) => {
    const newPrivacy = { ...privacy, [key]: !privacy[key] };
    setPrivacy(newPrivacy);
    await saveSettings(notifications, newPrivacy);
  };

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      alert('Funcionalidad en desarrollo');
    }
  };

  return (
    <AccountLayout title="Configuración">
      <div className="settings-container">
        {feedback && (
          <div className={`feedback-banner feedback-banner--${feedback.type}`} role="status" aria-live="polite">
            {feedback.type === 'success' ? <Check size={18} /> : <XCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        <section className="settings-section">
          <header className="section-header">
            <div className="section-heading">
              <div className="section-icon section-icon--accent">
                <Bell size={22} aria-hidden="true" />
              </div>
              <div>
                <h3>Notificaciones</h3>
                <p>Gestiona cómo y cuándo quieres enterarte de tus movimientos.</p>
              </div>
            </div>
            {saving && <span className="saving-pill">Guardando…</span>}
          </header>

          <div className="setting-grid">
            {notificationOptions.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.key} className="setting-card">
                  <div className="setting-card__content">
                    <div className="setting-card__icon">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={() => handleNotificationChange(item.key)}
                    />
                    <span className="toggle__slider" />
                  </label>
                </article>
              );
            })}
          </div>
        </section>

        <section className="settings-section">
          <header className="section-header">
            <div className="section-heading">
              <div className="section-icon section-icon--shield">
                <Shield size={22} aria-hidden="true" />
              </div>
              <div>
                <h3>Privacidad y seguridad</h3>
                <p>Controla tu visibilidad y quién puede interactuar contigo.</p>
              </div>
            </div>
          </header>

          <div className="setting-grid">
            {privacyOptions.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.key} className="setting-card">
                  <div className="setting-card__content">
                    <div className="setting-card__icon">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={privacy[item.key]}
                      onChange={() => handlePrivacyChange(item.key)}
                    />
                    <span className="toggle__slider" />
                  </label>
                </article>
              );
            })}
          </div>
        </section>

        <section className="settings-section">
          <header className="section-header">
            <div className="section-heading">
              <div className="section-icon">
                <Lock size={20} aria-hidden="true" />
              </div>
              <div>
                <h3>Seguridad</h3>
                <p>Mantén tu cuenta protegida con acciones rápidas.</p>
              </div>
            </div>
          </header>

          <div className="security-actions">
            <a href="/mi-cuenta/cambiar-password" className="security-button">
              <Lock size={18} aria-hidden="true" />
              Cambiar contraseña
            </a>
            <button type="button" className="security-button" onClick={() => signOut()}>
              <Shield size={18} aria-hidden="true" />
              Cerrar sesión en todos los dispositivos
            </button>
          </div>
        </section>

        <section className="settings-section">
          <header className="section-header">
            <div className="section-heading">
              <div className="section-icon section-icon--globe">
                <Globe size={20} aria-hidden="true" />
              </div>
              <div>
                <h3>Idioma y región</h3>
                <p>Personaliza cómo ves precios y contenido.</p>
              </div>
            </div>
          </header>

          <div className="preference-grid">
            <label className="preference-field">
              <span>Idioma</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languages.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="preference-field">
              <span>Moneda</span>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {currencies.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="settings-section settings-section--danger">
          <header className="section-header">
            <div className="section-heading">
              <div className="section-icon section-icon--danger">
                <Trash2 size={20} aria-hidden="true" />
              </div>
              <div>
                <h3>Zona peligrosa</h3>
                <p>Acciones irreversibles en tu cuenta.</p>
              </div>
            </div>
          </header>

          <button type="button" className="danger-button" onClick={handleDeleteAccount}>
            <Trash2 size={18} aria-hidden="true" />
            Eliminar mi cuenta
          </button>
        </section>
      </div>

      <style jsx>{`
        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .feedback-banner {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 12px 22px rgba(15, 23, 42, 0.12);
        }

        .feedback-banner--success {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid rgba(22, 101, 52, 0.2);
        }

        .feedback-banner--error {
          background-color: #fee2e2;
          color: #b91c1c;
          border: 1px solid rgba(185, 28, 28, 0.2);
        }

        .settings-section {
          background: white;
          border-radius: 20px;
          padding: 28px 30px;
          box-shadow: 0 20px 48px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.18);
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .settings-section--danger {
          border-color: rgba(248, 113, 113, 0.35);
          box-shadow: 0 24px 50px rgba(248, 113, 113, 0.15);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .section-heading h3 {
          font-size: 19px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }

        .section-heading p {
          margin: 0;
          font-size: 14px;
          color: rgba(15, 23, 42, 0.65);
        }

        .section-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(148, 163, 184, 0.18);
          color: #0f172a;
        }

        .section-icon--accent {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(14, 165, 233, 0.24) 100%);
          color: #1d4ed8;
        }

        .section-icon--shield {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.22) 0%, rgba(59, 130, 246, 0.2) 100%);
          color: #15803d;
        }

        .section-icon--globe {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.22) 0%, rgba(56, 189, 248, 0.28) 100%);
          color: #0284c7;
        }

        .section-icon--danger {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.22) 0%, rgba(248, 113, 113, 0.28) 100%);
          color: #b91c1c;
        }

        .saving-pill {
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 999px;
          background-color: rgba(37, 99, 235, 0.08);
          color: #1d4ed8;
        }

        .setting-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
        }

        .setting-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 16px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background-color: #f8fbff;
        }

        .setting-card__content {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .setting-card__icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background-color: rgba(148, 163, 184, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563eb;
        }

        .setting-card h4 {
          margin: 0 0 6px 0;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
        }

        .setting-card p {
          margin: 0;
          font-size: 13px;
          color: rgba(15, 23, 42, 0.65);
        }

        .toggle {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: 46px;
          height: 26px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle__slider {
          position: absolute;
          inset: 0;
          background-color: rgba(148, 163, 184, 0.45);
          border-radius: 999px;
          transition: all 0.2s ease;
        }

        .toggle__slider::before {
          content: '';
          position: absolute;
          height: 20px;
          width: 20px;
          left: 3px;
          top: 3px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.2s ease;
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.15);
        }

        .toggle input:checked + .toggle__slider {
          background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
        }

        .toggle input:checked + .toggle__slider::before {
          transform: translateX(20px);
        }

        .security-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .security-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.2);
          background-color: white;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .security-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px rgba(15, 23, 42, 0.16);
        }

        .preference-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
        }

        .preference-field {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .preference-field select {
          appearance: none;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.24);
          background-color: #f8fbff;
          font-size: 14px;
          font-weight: 500;
          color: #0f172a;
        }

        .danger-button {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: 12px;
          border: 1px solid rgba(239, 68, 68, 0.4);
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.16) 100%);
          color: #b91c1c;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .danger-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 22px rgba(239, 68, 68, 0.18);
        }

        @media (max-width: 768px) {
          .settings-section {
            padding: 24px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .security-actions {
            flex-direction: column;
          }

          .security-button,
          .danger-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 540px) {
          .settings-section {
            padding: 20px;
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

  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/user/settings`,
      {
        headers: {
          cookie: context.req.headers.cookie || '',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        props: {
          initialSettings: data,
        },
      };
    }
  } catch (error) {
    console.error('Error al cargar configuraciones:', error);
  }

  return {
    props: {
      initialSettings: null,
    },
  };
}

export default ConfiguracionPage;
