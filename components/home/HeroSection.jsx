import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import styles from '../../styles/pages/home.module.css';

const HERO_METRICS = [
  { label: 'Dispositivos reacondicionados', value: '+12.500' },
  { label: 'CO2 ahorrado', value: '28 Tn' },
  { label: 'Clientes satisfechos', value: '4.8/5' },
  { label: 'Garantia extendida', value: '12+ meses' },
];

export default function HeroSection() {
  const [heroItems, setHeroItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fade, setFade] = useState(true);

  // Obtener ofertas y posts destacados
  useEffect(() => {
    let isMounted = true;

    const fetchHeroContent = async () => {
      try {
        const [offersRes, postsRes] = await Promise.all([
          fetch('/api/hero/featured-offers'),
          fetch('/api/hero/featured-posts'),
        ]);

        const offersData = await offersRes.json();
        const postsData = await postsRes.json();

        if (!isMounted) {
          return;
        }

        const combined = [];
        const maxLength = Math.max(offersData.offers?.length || 0, postsData.posts?.length || 0);

        for (let i = 0; i < maxLength; i += 1) {
          if (offersData.offers?.[i]) combined.push(offersData.offers[i]);
          if (postsData.posts?.[i]) combined.push(postsData.posts[i]);
        }

        setHeroItems(combined);
      } catch (error) {
        console.error('Error fetching hero content:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHeroContent();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pre-cargar imagenes para mejoras visuales
  useEffect(() => {
    if (heroItems.length === 0 || typeof window === 'undefined') return;
    heroItems.forEach((item) => {
      if (!item?.image) return;
      const preload = new window.Image();
      preload.src = item.image;
    });
  }, [heroItems]);

  // Auto-rotacion cada 6 segundos
  useEffect(() => {
    if (heroItems.length === 0) return undefined;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroItems.length);
        setFade(true);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [heroItems.length]);

  const goToSlide = (index) => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(true);
    }, 300);
  };

  const goToPrevious = () => {
    goToSlide(currentIndex === 0 ? heroItems.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % heroItems.length);
  };

  if (isLoading || heroItems.length === 0) {
    return (
      <section className="section-container">
        <div className="section-inner">
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <span className={styles.badge}>Recommerce de confianza</span>
              <h1 className={styles.heroTitle}>
                Tecnologia reacondicionada certificada con 12 meses de garantia
              </h1>
              <p className={styles.heroSubtitle}>
                Compra con tranquilidad o vende sin friccion. Certificamos cada dispositivo con un
                control de 30 puntos, garantia premium y soporte experto.
              </p>
              <div className={styles.ctaGroup}>
                <Button href="/comprar">Comprar dispositivos</Button>
                <Button variant="outline" href="/vender">
                  Vender mi dispositivo
                </Button>
              </div>
            </div>
            <div className={styles.metricStrip}>
              {HERO_METRICS.map((metric) => (
                <div key={metric.label} className={styles.metricCard}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentItem = heroItems[currentIndex];
  const heroToneClass = currentItem?.type === 'offer' ? styles.heroOffer : styles.heroBlog;
  const backgroundStyle = currentItem?.image
    ? { backgroundImage: `url(${currentItem.image})` }
    : undefined;

  return (
    <section className="section-container">
      <div className="section-inner">
        <div className={`${styles.hero} ${heroToneClass}`}>
          {currentItem?.image && (
            <div className={styles.heroBackground} aria-hidden="true">
              <div
                className={`${styles.heroBackgroundImage} ${
                  fade ? styles.heroFadeIn : styles.heroFadeOut
                }`}
                style={backgroundStyle}
              />
              <div className={styles.heroBackgroundOverlay} />
            </div>
          )}

          <div
            className={`${styles.heroContent} ${fade ? styles.heroFadeIn : styles.heroFadeOut}`}
            role="region"
            aria-live="polite"
          >
            <span className={styles.badge}>{currentItem.badge}</span>
            <h1 className={styles.heroTitle}>{currentItem.title}</h1>
            <p className={styles.heroSubtitle}>{currentItem.subtitle}</p>

            {currentItem.type === 'offer' && currentItem.discount && (
              <div className={styles.offerInfo}>
                <span className={styles.discount}>-{currentItem.discount}</span>
                <span className={styles.price}>
                  <span className={styles.originalPrice}>${currentItem.originalPrice}</span>
                  <span className={styles.offerPrice}>${currentItem.offerPrice}</span>
                </span>
              </div>
            )}

            {currentItem.type === 'blog' && (
              <div className={styles.blogInfo}>
                <span className={styles.category}>{currentItem.category}</span>
                <span className={styles.readTime}>| {currentItem.readTime} de lectura</span>
              </div>
            )}

            <div className={styles.ctaGroup}>
              {currentItem.primaryCta?.href && (
                <Button href={currentItem.primaryCta.href}>{currentItem.primaryCta.text}</Button>
              )}
              {currentItem.secondaryCta?.href && (
                <Button variant="outline" href={currentItem.secondaryCta.href}>
                  {currentItem.secondaryCta.text}
                </Button>
              )}
            </div>
          </div>

          <div className={styles.carouselControls}>
            <button
              type="button"
              onClick={goToPrevious}
              className={styles.carouselArrow}
              aria-label="Anterior"
            >
              {'<'}
            </button>

            <div className={styles.carouselDots}>
              {heroItems.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                  aria-pressed={index === currentIndex}
                  aria-current={index === currentIndex}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goToNext}
              className={styles.carouselArrow}
              aria-label="Siguiente"
            >
              {'>'}
            </button>
          </div>

          <div className={styles.metricStrip}>
            {HERO_METRICS.map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
