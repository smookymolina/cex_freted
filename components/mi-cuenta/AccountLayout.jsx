import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import AccountSidebar from './AccountSidebar';

const AccountLayout = ({ children, title }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirigir si el usuario no está autenticado
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/mi-cuenta/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Cargando...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            color: #666;
            gap: 16px;
          }

          .loading-spinner {
            width: 42px;
            height: 42px;
            border: 3px solid #f1f5f9;
            border-top: 3px solid #0066cc;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userName = session.user?.name || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="account-layout" role="main">
      <div className="account-container">
        <header className="account-header">
          <div className="user-info">
            <div className="user-avatar" aria-hidden="true">
              {session.user?.image ? (
                <img src={session.user.image} alt={userName} />
              ) : (
                <div className="avatar-placeholder">{userInitial}</div>
              )}
            </div>
            <div className="user-details">
              <p className="user-overline">Mi cuenta</p>
              <h1 className="user-name">{userName}</h1>
              <p className="user-email">{session.user?.email}</p>
            </div>
          </div>
        </header>

        <div className="account-content">
          <aside className="account-sidebar-wrapper" aria-label="Navegación de Mi Cuenta">
            <AccountSidebar currentPath={router.pathname} />
          </aside>

          <section className="account-main" aria-live="polite">
            {title && (
              <header className="page-header">
                <h2 className="page-title">{title}</h2>
              </header>
            )}
            <div className="page-body">{children}</div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .account-layout {
          background-color: #eef2f7;
          min-height: 100vh;
          padding: 48px 0 56px;
        }

        .account-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .account-header {
          background: linear-gradient(135deg, #ffffff 0%, #f1f5ff 100%);
          border-radius: 16px;
          padding: 32px 40px;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .user-avatar {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          overflow: hidden;
          background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 30px rgba(14, 165, 233, 0.32);
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          font-size: 36px;
          font-weight: 600;
          color: white;
        }

        .user-details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .user-overline {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          color: rgba(15, 23, 42, 0.55);
          margin: 0;
        }

        .user-name {
          font-size: 30px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .user-email {
          font-size: 15px;
          color: rgba(15, 23, 42, 0.7);
          margin: 0;
          word-break: break-word;
        }

        .account-content {
          display: grid;
          grid-template-columns: minmax(260px, 300px) minmax(0, 1fr);
          gap: 32px;
          align-items: flex-start;
        }

        .account-sidebar-wrapper {
          position: sticky;
          top: 32px;
          align-self: flex-start;
        }

        .account-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        .page-header {
          background: white;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .page-title {
          font-size: 26px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .page-body {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (max-width: 1100px) {
          .account-content {
            grid-template-columns: 1fr;
          }

          .account-sidebar-wrapper {
            position: static;
            width: 100%;
          }
        }

        @media (max-width: 780px) {
          .account-layout {
            padding: 32px 0 40px;
          }

          .account-container {
            padding: 0 20px;
            gap: 24px;
          }

          .account-header {
            padding: 24px;
          }

          .user-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .user-avatar {
            width: 72px;
            height: 72px;
            box-shadow: 0 10px 28px rgba(14, 165, 233, 0.28);
          }

          .user-name {
            font-size: 24px;
          }

          .page-header {
            padding: 20px 24px;
          }
        }

        @media (max-width: 540px) {
          .account-container {
            padding: 0 16px;
          }

          .account-header {
            border-radius: 20px;
          }

          .page-header {
            border-radius: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default AccountLayout;
