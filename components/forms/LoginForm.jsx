import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/pages/Login.module.css';
import { getPostLoginRoute } from '../../utils/roleHome';

const isSafeRedirect = (value) => typeof value === 'string' && value.startsWith('/');

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.query.reset === 'success') {
      setSuccess('Contraseña restablecida exitosamente. Ya puedes iniciar sesión.');
      const timeoutId = setTimeout(() => {
        setSuccess('');
        router.replace('/mi-cuenta/login', undefined, { shallow: true });
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [router]);

  useEffect(() => {
    if (isSafeRedirect(router.query.callbackUrl)) {
      setInfo('Inicia sesión para continuar con tu compra.');
    } else {
      setInfo('');
    }
  }, [router.query.callbackUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setInfo('');
    setLoading(true);

    const callbackUrl = isSafeRedirect(router.query.callbackUrl)
      ? router.query.callbackUrl
      : '/mi-cuenta/perfil';

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Role-based redirect centralizado
    const session = await getSession();
    const nextRoute = getPostLoginRoute({
      callbackUrl,
      user: session?.user,
    });
    router.push(nextRoute);
  };

  return (
    <div className={styles.formWrapper}>
      <h1 className={styles.title}>Iniciar sesión</h1>
      <p className={styles.subtitle}>Bienvenido de nuevo</p>
      <form onSubmit={handleSubmit}>
        {info && <p className={styles.info}>{info}</p>}
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <div className={styles.formGroup}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
        <div className={styles.forgotPassword}>
          <Link href="/mi-cuenta/forgot-password" className={styles.forgotLink}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
      <Link href="/mi-cuenta/registro" className={styles.link}>
        ¿No tienes una cuenta? Regístrate
      </Link>
    </div>
  );
};

export default LoginForm;
