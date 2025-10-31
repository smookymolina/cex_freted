import { forwardRef } from 'react';
import Link from 'next/link';
import styles from '../../styles/components/button.module.css';

const variantClassMap = {
  solid: styles.solid,
  outline: styles.outline,
  ghost: styles.ghost,
  secondary: styles.secondary,
};

const Button = forwardRef(function Button(
  {
    children,
    href,
    variant = 'solid',
    className = '',
    fullWidth = false,
    ...rest
  },
  ref
) {
  const { type, ...props } = rest;

  const composedClassName = [
    styles.button,
    variantClassMap[variant] ?? styles.solid,
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link ref={ref} href={href} className={composedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      className={composedClassName}
      type={type ?? 'button'}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
