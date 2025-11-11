
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error('Por favor, introduce tu email y contraseña');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
            emailVerified: true,
          }
        });

        if (!user || !user.password) {
          throw new Error('No se encontró un usuario con ese email');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('La contraseña es incorrecta');
        }

        // Verificación de email desactivada - los usuarios pueden iniciar sesión sin verificar
        // Descomentar las siguientes líneas para ACTIVAR verificación obligatoria:
        // if (!user.emailVerified) {
        //   throw new Error('Por favor verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada o carpeta de spam.');
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/mi-cuenta/login',
    error: '/mi-cuenta/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Usar rutas absolutas en desarrollo
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Si la URL ya contiene el baseUrl, devolverla tal cual
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Por defecto, redirigir al baseUrl
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'a_default_secret_for_development',
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
