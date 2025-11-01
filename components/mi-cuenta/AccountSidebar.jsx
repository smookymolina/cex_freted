import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
} from 'lucide-react';

const menuItems = [
  {
    icon: User,
    label: 'Mi perfil',
    href: '/mi-cuenta/perfil',
    description: 'Información personal',
  },
  {
    icon: ShoppingBag,
    label: 'Mis pedidos',
    href: '/mi-cuenta/pedidos',
    description: 'Historial y seguimiento',
  },
  {
    icon: Heart,
    label: 'Favoritos',
    href: '/mi-cuenta/favoritos',
    description: 'Productos guardados',
  },
  {
    icon: MapPin,
    label: 'Direcciones',
    href: '/mi-cuenta/direcciones',
    description: 'Opciones de envío',
  },
  {
    icon: CreditCard,
    label: 'Pagos',
    href: '/mi-cuenta/pagos',
    description: 'Métodos vinculados',
  },
  {
    icon: Bell,
    label: 'Notificaciones',
    href: '/mi-cuenta/notificaciones',
    description: 'Alertas y recordatorios',
  },
  {
    icon: Settings,
    label: 'Configuración',
    href: '/mi-cuenta/configuracion',
    description: 'Preferencias de cuenta',
  },
];

const AccountSidebar = ({ currentPath }) => {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (href) => {
    const basePath = currentPath || router.pathname;
    return basePath === href;
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    await signOut({ callbackUrl: '/' });
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="account-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Mi Cuenta</h2>
          <p className="sidebar-subtitle">Administra tu experiencia en un solo lugar.</p>
        </div>

        <nav className="sidebar-nav" aria-label="Opciones de Mi Cuenta">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-item${active ? ' nav-item--active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span className="nav-item-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="nav-item-content">
                      <span className="nav-item-label">{item.label}</span>
                      <span className="nav-item-description">{item.description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="nav-utility">
            <Link href="/soporte" className="utility-link">
              <span className="nav-item-icon">
                <HelpCircle size={20} aria-hidden="true" />
              </span>
              <span className="nav-item-content">
                <span className="nav-item-label">Centro de ayuda</span>
                <span className="nav-item-description">Preguntas frecuentes, garantías y soporte</span>
              </span>
            </Link>

            <button type="button" className="utility-link utility-link--logout" onClick={handleLogoutClick}>
              <span className="nav-item-icon">
                <LogOut size={20} aria-hidden="true" />
              </span>
              <span className="nav-item-content">
                <span className="nav-item-label">Cerrar sesión</span>
                <span className="nav-item-description">Salir de tu cuenta de manera segura</span>
              </span>
            </button>
          </div>
        </nav>
      </div>

      {showLogoutModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="logout-title">
          <div className="modal-content">
            <div className="modal-header">
              <LogOut size={28} className="modal-icon" aria-hidden="true" />
              <h3 id="logout-title" className="modal-title">
                ¿Cerrar sesión?
              </h3>
            </div>
            <p className="modal-message">
              Si sales de tu cuenta perderás el acceso a tus pedidos, favoritos y publicaciones hasta volver a iniciar
              sesión.
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={handleCancelLogout}>
                Mantenerme conectado
              </button>
              <button type="button" className="btn-primary" onClick={handleConfirmLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .account-sidebar {
          background: white;
          border-radius: 16px;
          padding: 28px 24px;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.18);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sidebar-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-title {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
        }

        .sidebar-subtitle {
          margin: 0;
          font-size: 13px;
          color: rgba(15, 23, 42, 0.65);
          line-height: 1.4;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nav-item {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid transparent;
          text-decoration: none;
          background-color: #f8fafc;
          transition: all 0.2s ease;
          color: inherit;
        }

        .nav-item:hover {
          border-color: rgba(59, 130, 246, 0.35);
          background-color: #f1f5ff;
          transform: translateX(2px);
          box-shadow: 0 10px 28px rgba(59, 130, 246, 0.12);
        }

        .nav-item--active {
          background: linear-gradient(135deg, #0066cc 0%, #0ea5e9 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 16px 30px rgba(14, 165, 233, 0.24);
        }

        .nav-item--active .nav-item-description {
          color: rgba(255, 255, 255, 0.85);
        }

        .nav-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background-color: rgba(148, 163, 184, 0.15);
          color: #0f172a;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .nav-item--active .nav-item-icon {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .nav-item-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item-label {
          font-size: 15px;
          font-weight: 600;
        }

        .nav-item-description {
          font-size: 13px;
          color: rgba(15, 23, 42, 0.65);
          line-height: 1.3;
        }

        .nav-utility {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(148, 163, 184, 0.2);
        }

        .utility-link {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          background-color: #ffffff;
          color: inherit;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .utility-link:hover {
          border-color: rgba(59, 130, 246, 0.4);
          background-color: #f8fbff;
          transform: translateX(2px);
          box-shadow: 0 12px 28px rgba(59, 130, 246, 0.12);
        }

        .utility-link--logout {
          border-color: rgba(239, 68, 68, 0.35);
        }

        .utility-link--logout:hover {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(248, 113, 113, 0.2) 100%);
          box-shadow: 0 12px 28px rgba(239, 68, 68, 0.18);
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 420px;
          width: 100%;
          box-shadow: 0 30px 60px rgba(15, 23, 42, 0.18);
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: slideUp 0.25s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(18px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          color: #ef4444;
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
        }

        .modal-message {
          margin: 0;
          font-size: 14px;
          color: rgba(15, 23, 42, 0.72);
          line-height: 1.6;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .btn-secondary,
        .btn-primary {
          padding: 10px 22px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn-secondary {
          background-color: #f1f5f9;
          color: #0f172a;
        }

        .btn-secondary:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(148, 163, 184, 0.2);
        }

        .btn-primary {
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 22px rgba(239, 68, 68, 0.25);
        }

        @media (max-width: 1100px) {
          .account-sidebar {
            padding: 24px;
          }
        }

        @media (max-width: 640px) {
          .account-sidebar {
            padding: 20px;
          }

          .nav-item,
          .utility-link {
            padding: 12px 14px;
            grid-template-columns: 36px minmax(0, 1fr);
          }

          .nav-item-icon,
          .utility-link .nav-item-icon {
            width: 36px;
            height: 36px;
          }

          .modal-content {
            padding: 28px 24px;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default AccountSidebar;
