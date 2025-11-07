import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/pages/Login.module.css';

const SoporteLoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Verificar que el usuario tenga rol SOPORTE
    const session = await getSession();

    if (session?.user?.role !== 'SOPORTE') {
      setError('Acceso denegado. Esta cuenta no tiene permisos de soporte técnico.');
      setLoading(false);
      // Cerrar sesión si no es soporte
      await fetch('/api/auth/signout', { method: 'POST' });
      return;
    }

    // Redirigir al panel de administración
    router.push('/admin/ordenes');
  };

  return (
    <div className={styles.formWrapper}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '24px',
          color: 'white'
        }}>
          🛠️
        </div>
        <h1 className={styles.title}>Portal de Soporte Técnico</h1>
        <p className={styles.subtitle}>Ingresa con tu cuenta de soporte</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email">Correo electrónico de soporte</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="soporte@cexfreted.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Verificando acceso...' : 'Acceder al panel'}
        </button>
      </form>

      <div style={{
        marginTop: '2rem',
        padding: '16px',
        background: '#f1f5f9',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#475569'
      }}>
        <strong>Nota:</strong> Este portal es exclusivo para el equipo de soporte técnico.
        Si eres cliente, ingresa desde <Link href="/mi-cuenta/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>aquí</Link>.
      </div>
    </div>
  );
};

export default SoporteLoginForm;
