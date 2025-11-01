
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/pages/Login.module.css';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mostrar mensaje si se restableció la contraseña exitosamente
    if (router.query.reset === 'success') {
      setSuccess('Contraseña restablecida exitosamente. Ya puedes iniciar sesión.');
      setTimeout(() => {
        setSuccess('');
        router.replace('/mi-cuenta/login', undefined, { shallow: true });
      }, 5000);
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/mi-cuenta/perfil');
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.title}>Iniciar Sesión</h1>
      <p className={styles.subtitle}>Bienvenido de nuevo</p>
      <form onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className={styles.forgotPassword}>
          <Link href="/mi-cuenta/forgot-password" className={styles.forgotLink}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      <Link href="/mi-cuenta/registro" className={styles.link}>
        ¿No tienes una cuenta? Regístrate
      </Link>
    </div>
  );
};

export default LoginForm;
