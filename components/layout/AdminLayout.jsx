import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { Package, DollarSign, LogOut, User, Menu, X, Shield } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hadAdminSession, setHadAdminSession] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'SOPORTE') {
      setHadAdminSession(true);
    }
  }, [status, session?.user?.role]);

  useEffect(() => {
    if (status === 'loading') return;

    // Proteger las rutas admin - Solo rol SOPORTE puede acceder
    if ((!session || session.user.role !== 'SOPORTE') && !hadAdminSession) {
      router.replace('/soporte/login');
    }
  }, [session, status, router, hadAdminSession]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/soporte/login' });
  };

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Cargando - Panel de Soporte</title>
        </Head>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc'
        }}>
          <p>Cargando...</p>
        </div>
      </>
    );
  }

  if (!session || session.user.role !== 'SOPORTE') {
    return null;
  }

  const menuItems = [
    {
      name: 'Órdenes',
      path: '/admin/ordenes',
      icon: Package,
    },
    {
      name: 'Pagos',
      path: '/admin/pagos',
      icon: DollarSign,
    },
  ];

  return (
    <>
      <Head>
        <title>Panel de Soporte - STI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="admin-layout">
        {/* Sidebar Desktop */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <span className="logo-icon">🛠️</span>
              <span className="logo-text">STI Soporte</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                <User size={18} />
              </div>
              <div className="user-details">
                <p className="user-name">{session.user.name || 'Soporte'}</p>
                <p className="user-email">{session.user.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="mobile-header">
          <div className="mobile-header-content">
            <div className="logo">
              <span className="logo-icon">🛠️</span>
              <span className="logo-text">STI Soporte</span>
            </div>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mobile-user">
              <div className="user-info">
                <User size={18} />
                <div>
                  <p className="user-name">{session.user.name || 'Soporte'}</p>
                  <p className="user-email">{session.user.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="main-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }

        /* Sidebar Desktop */
        .sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 10px;
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background: #f1f5f9;
          color: #2563eb;
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(29, 78, 216, 0.1));
          color: #2563eb;
          font-weight: 600;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 10px;
          margin-bottom: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .user-details {
          flex: 1;
          min-width: 0;
        }

        .user-name {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          margin: 0;
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #dc2626;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          z-index: 50;
        }

        .mobile-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
        }

        .mobile-menu-btn {
          padding: 8px;
          border: none;
          background: none;
          color: #0f172a;
          cursor: pointer;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 65px;
          left: 0;
          right: 0;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          z-index: 40;
          padding: 16px;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .mobile-user {
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .mobile-user .user-info {
          margin-bottom: 12px;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 40px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }

          .mobile-header {
            display: block;
          }

          .mobile-menu {
            display: block;
          }

          .main-content {
            margin-left: 0;
            margin-top: 65px;
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default AdminLayout;
