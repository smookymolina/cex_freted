import Head from 'next/head';
import Link from 'next/link';
import { FileText, Shield, CreditCard, Users, AlertCircle, RefreshCw, Scale } from 'lucide-react';

export default function TerminosPage() {
  return (
    <>
      <Head>
        <title>Términos y Condiciones | Sociedad Tecnológica Integral</title>
        <meta
          name="description"
          content="Lee nuestros términos y condiciones de uso. Conoce tus derechos y responsabilidades al usar canfret.com"
        />
      </Head>

      <main className="page">
        <div className="page-inner">
          <section className="hero">
            <div className="hero-icon">
              <FileText size={48} />
            </div>
            <h1>Términos y Condiciones</h1>
            <p className="hero-subtitle">
              Última actualización: 14 de noviembre de 2025
            </p>
            <p className="hero-description">
              Al utilizar los servicios de Sociedad Tecnológica Integral (canfret.com),
              aceptas estos términos y condiciones. Por favor, léelos detenidamente.
            </p>
          </section>

          <div className="content-grid">
            <aside className="table-of-contents">
              <h2>Contenido</h2>
              <nav>
                <a href="#aceptacion">1. Aceptación de los Términos</a>
                <a href="#uso">2. Uso de la Plataforma</a>
                <a href="#pago">3. Proceso de Pago</a>
                <a href="#privacidad">4. Privacidad y Protección de Datos</a>
                <a href="#responsabilidades">5. Responsabilidades del Usuario</a>
                <a href="#garantias">6. Garantías y Devoluciones</a>
                <a href="#modificaciones">7. Modificaciones</a>
                <a href="#contacto">8. Contacto</a>
              </nav>
            </aside>

            <article className="main-content">
              <section id="aceptacion" className="section">
                <div className="section-header">
                  <Scale className="section-icon" size={24} />
                  <h2>1. Aceptación de los Términos</h2>
                </div>
                <p>
                  Al acceder y utilizar los servicios de Sociedad Tecnológica Integral (en adelante, "la Plataforma"),
                  disponible en canfret.com, aceptas estar legalmente vinculado por estos términos y condiciones.
                </p>
                <p>
                  Si no estás de acuerdo con alguna parte de estos términos, por favor abstente de utilizar
                  nuestros servicios.
                </p>
                <div className="info-box">
                  <AlertCircle size={20} />
                  <p>
                    Al registrarte, confirmas que eres mayor de edad y tienes capacidad legal para
                    celebrar contratos vinculantes.
                  </p>
                </div>
              </section>

              <section id="uso" className="section">
                <div className="section-header">
                  <Users className="section-icon" size={24} />
                  <h2>2. Uso de la Plataforma</h2>
                </div>
                <p>
                  Nuestra plataforma es un marketplace que conecta compradores y vendedores de equipos
                  tecnológicos. Nos comprometemos a proporcionar un entorno seguro y confiable para
                  todas las transacciones.
                </p>
                <h3>2.1 Servicios que ofrecemos</h3>
                <ul>
                  <li>Facilitación de transacciones seguras entre compradores y vendedores verificados</li>
                  <li>Verificación de cada pago antes de liberar los pedidos a los vendedores</li>
                  <li>Soporte personalizado durante todo el proceso de compra</li>
                  <li>Protección de información personal según nuestra política de privacidad</li>
                  <li>Sistema de seguimiento de pedidos en tiempo real</li>
                </ul>
                <h3>2.2 Uso permitido</h3>
                <p>Te comprometes a:</p>
                <ul>
                  <li>Utilizar la plataforma únicamente con fines legítimos y legales</li>
                  <li>No realizar actividades fraudulentas o engañosas</li>
                  <li>Respetar los derechos de propiedad intelectual de la plataforma y terceros</li>
                  <li>No intentar acceder a áreas restringidas del sistema</li>
                  <li>No utilizar bots, scrapers o herramientas automatizadas no autorizadas</li>
                </ul>
              </section>

              <section id="pago" className="section">
                <div className="section-header">
                  <CreditCard className="section-icon" size={24} />
                  <h2>3. Proceso de Pago</h2>
                </div>
                <p>
                  Los pagos se realizan directamente al vendedor. Nuestro equipo de soporte actúa como
                  intermediario para garantizar la seguridad de la transacción.
                </p>
                <h3>3.1 Cómo funciona</h3>
                <ol>
                  <li>
                    <strong>Contacto inicial:</strong> Un asesor de soporte se comunicará contigo
                    para proporcionarte los datos oficiales de pago del vendedor
                  </li>
                  <li>
                    <strong>Realización del pago:</strong> Realizas el pago directamente al vendedor
                    utilizando el método acordado
                  </li>
                  <li>
                    <strong>Verificación:</strong> Nuestro equipo valida tu depósito con el vendedor
                    antes de liberar el pedido
                  </li>
                  <li>
                    <strong>Confirmación:</strong> Una vez verificado, el vendedor procede con el envío
                    de tu pedido
                  </li>
                </ol>
                <h3>3.2 Métodos de pago aceptados</h3>
                <ul>
                  <li>Transferencia bancaria directa</li>
                  <li>Depósito en efectivo</li>
                  <li>Pago en tienda de conveniencia (según disponibilidad)</li>
                  <li>Confirmación telefónica (para ciertos productos)</li>
                </ul>
                <div className="warning-box">
                  <Shield size={20} />
                  <p>
                    <strong>Seguridad:</strong> Nunca compartas tus datos bancarios completos a través
                    de correo electrónico o mensajes no verificados. Nuestro equipo solo te proporcionará
                    los datos de pago mediante llamada telefónica oficial.
                  </p>
                </div>
                <h3>3.3 Validación de pagos</h3>
                <p>
                  Cada pago es validado manualmente por nuestro equipo de soporte en un plazo máximo
                  de 15 minutos durante horario laboral. Este proceso garantiza que:
                </p>
                <ul>
                  <li>El vendedor confirme la recepción del pago</li>
                  <li>El monto sea correcto</li>
                  <li>La referencia de pago coincida con tu pedido</li>
                </ul>
              </section>

              <section id="privacidad" className="section">
                <div className="section-header">
                  <Shield className="section-icon" size={24} />
                  <h2>4. Privacidad y Protección de Datos</h2>
                </div>
                <p>
                  Tu privacidad es fundamental para nosotros. Nos comprometemos a proteger tu información
                  personal de acuerdo con las leyes aplicables de protección de datos.
                </p>
                <h3>4.1 Datos que recopilamos</h3>
                <ul>
                  <li>Información de registro: nombre, correo electrónico, teléfono</li>
                  <li>Datos de envío: dirección, ciudad, estado, código postal</li>
                  <li>Historial de pedidos y transacciones</li>
                  <li>Información de navegación y uso de la plataforma (cookies)</li>
                </ul>
                <h3>4.2 Uso de la información</h3>
                <p>Utilizamos tus datos para:</p>
                <ul>
                  <li>Procesar y gestionar tus pedidos</li>
                  <li>Comunicarnos contigo sobre el estado de tus compras</li>
                  <li>Mejorar nuestros servicios y experiencia de usuario</li>
                  <li>Cumplir con obligaciones legales y fiscales</li>
                  <li>Prevenir fraudes y garantizar la seguridad de la plataforma</li>
                </ul>
                <h3>4.3 Compartir información</h3>
                <p>
                  No compartimos tu información personal con terceros, excepto:
                </p>
                <ul>
                  <li>Con vendedores, únicamente los datos necesarios para procesar tu pedido</li>
                  <li>Con proveedores de servicios de envío para la entrega de productos</li>
                  <li>Cuando sea requerido por ley o autoridades competentes</li>
                </ul>
              </section>

              <section id="responsabilidades" className="section">
                <div className="section-header">
                  <Users className="section-icon" size={24} />
                  <h2>5. Responsabilidades del Usuario</h2>
                </div>
                <p>Como usuario de la plataforma, te comprometes a:</p>
                <h3>5.1 Información veraz</h3>
                <ul>
                  <li>Proporcionar información precisa, actualizada y completa durante el registro</li>
                  <li>Mantener actualizada tu información de contacto y envío</li>
                  <li>Notificar inmediatamente cualquier cambio en tus datos</li>
                </ul>
                <h3>5.2 Seguridad de la cuenta</h3>
                <ul>
                  <li>Mantener la confidencialidad de tu contraseña</li>
                  <li>No compartir tu cuenta con terceros</li>
                  <li>Notificar inmediatamente cualquier uso no autorizado</li>
                  <li>Cerrar sesión después de cada uso en dispositivos compartidos</li>
                </ul>
                <h3>5.3 Conducta apropiada</h3>
                <ul>
                  <li>Tratar con respeto a nuestro equipo de soporte y a otros usuarios</li>
                  <li>No realizar compras fraudulentas o engañosas</li>
                  <li>No intentar manipular precios o el sistema de la plataforma</li>
                  <li>Cumplir con todas las leyes aplicables en tu jurisdicción</li>
                </ul>
              </section>

              <section id="garantias" className="section">
                <div className="section-header">
                  <RefreshCw className="section-icon" size={24} />
                  <h2>6. Garantías y Devoluciones</h2>
                </div>
                <p>
                  Todos los productos vendidos en nuestra plataforma cuentan con garantía según las
                  políticas del vendedor y la legislación aplicable.
                </p>
                <h3>6.1 Garantía de productos</h3>
                <ul>
                  <li>Los productos nuevos cuentan con garantía del fabricante</li>
                  <li>Los productos reacondicionados tienen garantía mínima de 90 días</li>
                  <li>La garantía cubre defectos de fabricación y funcionamiento</li>
                  <li>No cubre daños por uso inadecuado o accidentes</li>
                </ul>
                <h3>6.2 Política de devoluciones</h3>
                <p>
                  Tienes derecho a devolver productos bajo las siguientes condiciones:
                </p>
                <ul>
                  <li>Dentro de los primeros 7 días desde la recepción</li>
                  <li>Producto en condiciones originales, sin uso y con embalaje intacto</li>
                  <li>Incluir todos los accesorios y documentación original</li>
                  <li>Presentar comprobante de compra</li>
                </ul>
                <p>
                  Para más información detallada, consulta nuestra{' '}
                  <Link href="/garantias">página de garantías</Link>.
                </p>
              </section>

              <section id="modificaciones" className="section">
                <div className="section-header">
                  <RefreshCw className="section-icon" size={24} />
                  <h2>7. Modificaciones a los Términos</h2>
                </div>
                <p>
                  Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
                  Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.
                </p>
                <h3>7.1 Notificación de cambios</h3>
                <ul>
                  <li>Te notificaremos sobre cambios significativos por correo electrónico</li>
                  <li>La fecha de "Última actualización" se modificará en esta página</li>
                  <li>Es tu responsabilidad revisar periódicamente estos términos</li>
                </ul>
                <h3>7.2 Aceptación de cambios</h3>
                <p>
                  El uso continuado de la plataforma después de la publicación de cambios constituye
                  tu aceptación de los nuevos términos.
                </p>
              </section>

              <section id="contacto" className="section">
                <div className="section-header">
                  <AlertCircle className="section-icon" size={24} />
                  <h2>8. Contacto</h2>
                </div>
                <p>
                  Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos:
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Correo electrónico:</strong>
                    <p>soporte@canfret.com</p>
                  </div>
                  <div className="contact-item">
                    <strong>Página de soporte:</strong>
                    <p>
                      <Link href="/soporte">canfret.com/soporte</Link>
                    </p>
                  </div>
                  <div className="contact-item">
                    <strong>Horario de atención:</strong>
                    <p>Lunes a Viernes: 9:00 AM - 6:00 PM (hora local)</p>
                  </div>
                </div>
              </section>
            </article>
          </div>

          <section className="cta-section">
            <h2>¿Todo claro?</h2>
            <p>
              Si aceptas estos términos y condiciones, puedes proceder a crear tu cuenta o
              continuar explorando nuestra plataforma.
            </p>
            <div className="cta-buttons">
              <Link href="/mi-cuenta/registro" className="button-primary">
                Crear cuenta
              </Link>
              <Link href="/comprar" className="button-secondary">
                Explorar productos
              </Link>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .page {
          background: #f5f7fb;
          min-height: 100vh;
          padding: 48px 20px 80px;
        }

        .page-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero {
          text-align: center;
          padding: 60px 20px;
          margin-bottom: 48px;
        }

        .hero-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .hero h1 {
          font-size: 3rem;
          margin: 0 0 16px;
          color: #0f172a;
          font-weight: 800;
        }

        .hero-subtitle {
          color: rgba(15, 23, 42, 0.6);
          font-size: 0.95rem;
          margin: 0 0 24px;
        }

        .hero-description {
          max-width: 700px;
          margin: 0 auto;
          font-size: 1.15rem;
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.7;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 48px;
          align-items: start;
        }

        .table-of-contents {
          position: sticky;
          top: 100px;
          background: white;
          padding: 28px;
          border-radius: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .table-of-contents h2 {
          font-size: 1.1rem;
          margin: 0 0 20px;
          color: #0f172a;
        }

        .table-of-contents nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .table-of-contents a {
          color: rgba(15, 23, 42, 0.7);
          text-decoration: none;
          font-size: 0.9rem;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .table-of-contents a:hover {
          background: rgba(37, 99, 235, 0.08);
          color: #2563eb;
        }

        .main-content {
          background: white;
          padding: 48px;
          border-radius: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .section {
          margin-bottom: 56px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(15, 23, 42, 0.08);
        }

        .section-icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        .section h2 {
          font-size: 1.75rem;
          color: #0f172a;
          margin: 0;
        }

        .section h3 {
          font-size: 1.25rem;
          color: #0f172a;
          margin: 32px 0 16px;
        }

        .section p {
          line-height: 1.8;
          color: rgba(15, 23, 42, 0.8);
          margin: 0 0 16px;
        }

        .section ul,
        .section ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .section li {
          margin-bottom: 12px;
          line-height: 1.7;
          color: rgba(15, 23, 42, 0.75);
        }

        .section :global(a) {
          color: #2563eb;
          text-decoration: none;
          font-weight: 600;
        }

        .section :global(a):hover {
          text-decoration: underline;
        }

        .info-box,
        .warning-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 20px;
          border-radius: 16px;
          margin: 24px 0;
        }

        .info-box {
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.2);
        }

        .info-box :global(svg) {
          color: #2563eb;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .warning-box {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .warning-box :global(svg) {
          color: #f59e0b;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .info-box p,
        .warning-box p {
          margin: 0;
          color: rgba(15, 23, 42, 0.8);
          line-height: 1.7;
        }

        .contact-info {
          display: grid;
          gap: 24px;
          margin-top: 24px;
        }

        .contact-item {
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .contact-item strong {
          display: block;
          color: #0f172a;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .contact-item p {
          margin: 0;
          color: rgba(15, 23, 42, 0.7);
        }

        .cta-section {
          margin-top: 64px;
          padding: 48px;
          background: linear-gradient(135deg, #eff6ff, #e0f2fe);
          border-radius: 24px;
          text-align: center;
        }

        .cta-section h2 {
          font-size: 2rem;
          margin: 0 0 16px;
          color: #0f172a;
        }

        .cta-section p {
          max-width: 600px;
          margin: 0 auto 32px;
          font-size: 1.05rem;
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.7;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .button-primary,
        .button-secondary {
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .button-primary {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
        }

        .button-secondary {
          background: white;
          color: #0f172a;
          border: 2px solid rgba(15, 23, 42, 0.1);
        }

        .button-secondary:hover {
          border-color: rgba(15, 23, 42, 0.25);
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .table-of-contents {
            position: relative;
            top: 0;
          }
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }

          .main-content {
            padding: 32px 24px;
          }

          .cta-section {
            padding: 32px 24px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .button-primary,
          .button-secondary {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
