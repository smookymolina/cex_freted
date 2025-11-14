import Button from '../ui/Button';
import ProductCard from '../product/ProductCard';
import { products } from '../../data/mock/products';
import styles from '../../styles/pages/home.module.css';

const contentHighlights = [
  {
    title: 'Guia definitiva del sistema de grados',
    description:
      'Aprende a identificar la condicion real de tu dispositivo y optimiza la cotización con fotos de ejemplo.',
    href: '/vender/guia-grados',
    cta: 'Leer la guia',
  },
  {
    title: 'Comparativa iPhone 14 vs iPhone 15',
    description:
      'Analizamos rendimiento, bateria y camara con foco en la mejor relacion valor/precio reacondicionado.',
    href: '/comprar/comparativas',
    cta: 'Ver comparativa',
  },
  {
    title: 'Programa de referidos',
    description:
      'Invita a tu comunidad y recibe hasta 50 EUR por cada venta o compra completada con tu enlace.',
    href: '/comunidad',
    cta: 'Sumarme al programa',
  },
];

export default function FeaturedContent() {
  return (
    <section className="section-container">
      <div className="section-inner">
        <div className={styles.sectionHeading}>
          <span className={styles.badge}>Contenido y catalogo</span>
          <h2>Explora productos destacados y recursos clave</h2>
          <p>
            Aunque el inventario esta en construccion, anticipamos la experiencia con fichas modelo y
            contenidos estrategicos.
          </p>
        </div>
        <div className={styles.productGrid}>
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <h3>Recursos que construyen confianza</h3>
            <p>Actualizaremos cada pieza a medida que el contenido oficial este disponible.</p>
          </div>
          <div className={styles.contentGrid}>
            {contentHighlights.map((item) => (
              <article key={item.title} className={styles.contentCard}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <a className={styles.inlineLink} href={item.href}>
                  {item.cta} →
                </a>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.ctaBanner}>
          <div>
            <h3>Quieres ser de los primeros en probar la plataforma?</h3>
            <p>
              Registrate para recibir acceso anticipado, ofertas beta y participar en pruebas de
              usabilidad.
            </p>
          </div>
          <div className={styles.ctaBannerButtons}>
            <Button href="/mi-cuenta/registro">Crear mi cuenta</Button>
            <Button variant="outline" href="/soporte/contacto">
              Hablar con un experto
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
