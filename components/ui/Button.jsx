import Link from 'next/link';
import styles from '../../styles/components/button.module.css';

const variantClassMap = {
  solid: styles.solid,
  outline: styles.outline,
  ghost: styles.ghost,
  secondary: styles.secondary,
};

export default function Button({ children, href, variant = 'solid', ...props }) {
  const className = `${styles.button} ${variantClassMap[variant] ?? styles.solid}`;

  if (href) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type="button" {...props}>
      {children}
    </button>
  );
}
