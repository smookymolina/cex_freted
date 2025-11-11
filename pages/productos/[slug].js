import { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../../components/ui/Button';
import { useCart } from '../../context/cart/CartContext';
import { products } from '../../data/mock/products';
import { productDetailsBySlug } from '../../data/product-details';
import styles from '../../styles/pages/product-detail.module.css';
import { BUEN_FIN_PROMO } from '../../config/promotions';

const CURRENCY_FORMATTER = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

const DEFAULT_GRADE_INFO = {
  'A+': {
    title: 'Como nuevo',
    description: 'Sin marcas visibles; rendimiento y batería superiores al 90%.',
  },
  A: {
    title: 'Excelente estado',
    description: 'Microdetalles estéticos mínimos; 100% funcional.',
  },
  B: {
    title: 'Buen estado',
    description: 'Ligero desgaste cosmético; calibrado y totalmente operativo.',
  },
};

const SHIPPING_LABELS = {
  delivery: 'Entrega express',
  pickup: 'Recojo en tienda',
  insurance: 'Cobertura y seguro',
  returns: 'Devoluciones fáciles',
  support: 'Soporte incluido',
};

export default function ProductDetailPage({ product }) {
  const { addToCart } = useCart();
  const variants = Array.isArray(product?.variants) ? product.variants : [];

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(() => {
    if (!variants.length) return 0;
    const firstAvailable = variants.findIndex(
      (variant) => variant?.stock === undefined || variant.stock > 0
    );
    return firstAvailable >= 0 ? firstAvailable : 0;
  });
  const [justAdded, setJustAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (!Array.isArray(product?.variants) || product.variants.length === 0) {
      setSelectedVariantIndex(0);
      setActiveImageIndex(0);
      return;
    }

    const firstAvailable = product.variants.findIndex(
      (variant) => variant?.stock === undefined || variant.stock > 0
    );

    setSelectedVariantIndex(firstAvailable >= 0 ? firstAvailable : 0);
    setActiveImageIndex(0);
  }, [product?.slug, product?.variants]);

  useEffect(() => {
    if (!justAdded) return undefined;
    const timeout = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timeout);
  }, [justAdded]);

  const selectedVariant = variants[selectedVariantIndex] ?? variants[0] ?? null;
  const fallbackImage = product?.image || '/assets/images/placeholder-base.png';
  const details = product?.details ?? {};
  const buenFinActive = Boolean(product?.buenFinApplied);
  const buenFinSavings = buenFinActive
    ? selectedVariant?.buenFinSavings ?? product?.buenFinSavings ?? null
    : null;

  const galleryImages =
    Array.isArray(details.gallery) && details.gallery.length > 0
      ? details.gallery
      : [{ src: fallbackImage, alt: product?.name ?? 'Producto reacondicionado' }];

  const activeImage =
    galleryImages[activeImageIndex] ?? galleryImages[galleryImages.length - 1];

  const isOutOfStock =
    !selectedVariant ||
    (selectedVariant.stock !== undefined && selectedVariant.stock < 1);

  const availableGrades = variants
    .map((variant) => variant?.grade)
    .filter(Boolean);

  const gradeNotesFromData = Array.isArray(details.gradeNotes)
    ? details.gradeNotes.filter((note) => availableGrades.includes(note.grade))
    : [];

  const fallbackGradeNotes = availableGrades
    .map((grade) => {
      const base = DEFAULT_GRADE_INFO[grade];
      return base ? { grade, ...base } : null;
    })
    .filter(Boolean);

  const gradeNotes = gradeNotesFromData.length
    ? gradeNotesFromData
    : fallbackGradeNotes;

  const shippingEntries = Object.entries(details.shippingInfo ?? {}).filter(
    ([, value]) => Boolean(value)
  );

  const highlights = Array.isArray(details.highlights) ? details.highlights : [];
  const descriptionParagraphs = Array.isArray(details.fullDescription)
    ? details.fullDescription
    : [];
  const technicalSpecs = Array.isArray(details.technicalSpecs)
    ? details.technicalSpecs
    : [];
  const inspectionChecklist = Array.isArray(details.inspectionChecklist)
    ? details.inspectionChecklist
    : [];
  const includedItems = Array.isArray(details.includedItems)
    ? details.includedItems
    : [];
  const support = details.support;

  const handleAddToCart = () => {
    if (isOutOfStock || !selectedVariant) return;

    const cartItemId = `${product.slug}-${selectedVariant.grade}`.toLowerCase();
    const cartItem = {
      id: cartItemId,
      name: product.name,
      slug: product.slug,
      image: activeImage?.src || fallbackImage,
      grade: selectedVariant.grade,
      category: product.category,
      price: selectedVariant.price,
      originalPrice: selectedVariant.originalPrice,
      stock: selectedVariant.stock,
    };

    addToCart(cartItem, 1);
    setJustAdded(true);
  };

  const addButtonLabel = (() => {
    if (isOutOfStock) return 'Sin stock';
    if (justAdded) return 'Agregado al carrito';
    return 'Añadir al carrito';
  })();

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <Button href="/comprar" variant="ghost">
          ← Volver al catálogo
        </Button>
      </div>

      <div className={styles.productGrid}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <Image
              key={activeImage?.src}
              src={activeImage?.src || fallbackImage}
              alt={activeImage?.alt || product.name}
              width={640}
              height={640}
              className={styles.image}
              priority
            />
          </div>

          {galleryImages.length > 1 && (
            <div className={styles.thumbnailStrip}>
              {galleryImages.map((image, index) => (
                <button
                  key={`${product.slug}-thumb-${index}`}
                  type="button"
                  className={`${styles.thumbnailButton} ${
                    index === activeImageIndex ? styles.thumbnailButtonActive : ''
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Ver imagen ${index + 1} de ${galleryImages.length}`}
                  aria-pressed={index === activeImageIndex}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `${product.name} detalle ${index + 1}`}
                    width={96}
                    height={96}
                    className={styles.thumbnailImage}
                  />
                </button>
              ))}
            </div>
          )}

          <div className={styles.badges}>
            <span className={styles.badge}>Garantía 12 meses</span>
            <span className={styles.badge}>Envío gratis</span>
            <span className={styles.badge}>Certificado incluido</span>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.header}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.name}</h1>
            {details.tagline && <p className={styles.tagline}>{details.tagline}</p>}
          </div>

          <div className={styles.priceSection}>
            <div className={styles.priceMain}>
              <span className={styles.currentPrice}>
                {selectedVariant ? CURRENCY_FORMATTER.format(selectedVariant.price) : '--'}
              </span>
              {selectedVariant?.originalPrice && (
                <span className={styles.originalPrice}>
                  {CURRENCY_FORMATTER.format(selectedVariant.originalPrice)}
                </span>
              )}
            </div>
            {selectedVariant?.originalPrice && (
              <div className={styles.savings}>
                Ahorra{' '}
                {CURRENCY_FORMATTER.format(
                  selectedVariant.originalPrice - selectedVariant.price
                )}
              </div>
            )}
            {buenFinActive && buenFinSavings && (
              <div className={styles.promoBanner}>
                {BUEN_FIN_PROMO.badge}: {CURRENCY_FORMATTER.format(buenFinSavings)} extra aplicado
                automaticamente
              </div>
            )}
          </div>

          {variants.length > 0 && (
            <div className={styles.variantSection}>
              <h3>Selecciona el grado</h3>
              <div className={styles.variantList}>
                {variants.map((variant, index) => {
                  const variantOutOfStock =
                    variant?.stock !== undefined && variant.stock < 1;

                  return (
                    <button
                      key={`${product.slug}-${variant.grade}`}
                      type="button"
                      className={`${styles.variantCard} ${
                        index === selectedVariantIndex ? styles.variantCardSelected : ''
                      } ${variantOutOfStock ? styles.variantCardDisabled : ''}`}
                      onClick={() => setSelectedVariantIndex(index)}
                      disabled={variantOutOfStock}
                    >
                      <div className={styles.variantHeader}>
                        <span className={styles.variantGrade}>Grade {variant.grade}</span>
                        {variantOutOfStock && (
                          <span className={styles.outOfStock}>Sin stock</span>
                        )}
                      </div>
                      <div className={styles.variantPrice}>
                        {CURRENCY_FORMATTER.format(variant.price)}
                      </div>
                      {buenFinActive && variant.buenFinSavings && (
                        <div className={styles.variantPromo}>
                          -{CURRENCY_FORMATTER.format(variant.buenFinSavings)} Buen Fin extra
                        </div>
                      )}
                      <div className={styles.variantStock}>
                        {variantOutOfStock
                          ? 'Agotado'
                          : variant?.stock
                          ? `${variant.stock} disponibles`
                          : 'Stock disponible'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Button onClick={handleAddToCart} fullWidth disabled={isOutOfStock}>
              {addButtonLabel}
            </Button>
            <Button href="/checkout/carrito" fullWidth variant="secondary">
              Ver carrito
            </Button>
          </div>

          {details.shortDescription && (
            <section className={styles.description}>
              <h3>Descripción</h3>
              <p className={styles.descriptionLead}>{details.shortDescription}</p>
              {descriptionParagraphs.map((paragraph, index) => (
                <p
                  key={`${product.slug}-description-${index}`}
                  className={styles.descriptionParagraph}
                >
                  {paragraph}
                </p>
              ))}
            </section>
          )}

          {highlights.length > 0 && (
            <section className={styles.highlights}>
              <h3>Razones para elegirlo</h3>
              <div className={styles.highlightGrid}>
                {highlights.map((item) => (
                  <article key={item.title} className={styles.highlightCard}>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(technicalSpecs.length > 0 ||
            inspectionChecklist.length > 0 ||
            includedItems.length > 0) && (
            <div className={styles.detailGrid}>
              {technicalSpecs.length > 0 && (
                <section className={styles.specifications}>
                  <h3>Ficha técnica</h3>
                  <dl className={styles.specsList}>
                    {technicalSpecs.map((spec) => (
                      <div key={spec.label} className={styles.specItem}>
                        <dt>{spec.label}</dt>
                        <dd>{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {inspectionChecklist.length > 0 && (
                <section className={styles.inspection}>
                  <h3>Certificación técnica</h3>
                  <ul className={styles.inspectionList}>
                    {inspectionChecklist.map((item, index) => (
                      <li key={`${product.slug}-inspection-${index}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}

              {includedItems.length > 0 && (
                <section className={styles.included}>
                  <h3>Lo que recibes</h3>
                  <ul className={styles.includedList}>
                    {includedItems.map((item, index) => (
                      <li key={`${product.slug}-included-${index}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}

          {gradeNotes.length > 0 && (
            <section className={styles.gradeNotes}>
              <h3>¿Qué significa cada grade?</h3>
              <div className={styles.gradeGrid}>
                {gradeNotes.map((note) => (
                  <article
                    key={`${product.slug}-grade-${note.grade}`}
                    className={styles.gradeCard}
                  >
                    <span className={styles.gradeBadge}>Grade {note.grade}</span>
                    <h4>{note.title}</h4>
                    <p>{note.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {shippingEntries.length > 0 && (
            <section className={styles.logistics}>
              <h3>Envío y respaldo</h3>
              <div className={styles.logisticsGrid}>
                {shippingEntries.map(([key, value]) => (
                  <article key={key} className={styles.logisticsCard}>
                    <h4>{SHIPPING_LABELS[key] ?? key}</h4>
                    <p>{value}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {support && (
            <section className={styles.support}>
              <div className={styles.supportCard}>
                <div className={styles.supportContent}>
                  <h3>{support.title}</h3>
                  <p>{support.description}</p>
                </div>
                {support.href && (
                  <Button href={support.href} variant="outline">
                    {support.cta ?? 'Hablar con soporte'}
                  </Button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: products.map((item) => ({ params: { slug: item.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    return { notFound: true };
  }

  const details = productDetailsBySlug[product.slug] ?? {};

  return {
    props: {
      product: {
        ...product,
        variants: Array.isArray(product.variants)
          ? product.variants.map((variant) => ({ ...variant }))
          : [],
        details,
      },
    },
  };
}
