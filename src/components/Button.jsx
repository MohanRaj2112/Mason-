import React from 'react';
import { Link } from 'react-router-dom';

export const Button = ({
  children,
  to,
  href,
  variant = 'accent', // 'accent' | 'primary' | 'outline' | 'outline-white' | 'secondary' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  id,
  title,
  ...rest
}) => {
  const variantClass =
    variant === 'accent'
      ? 'btn-accent'
      : variant === 'primary'
      ? 'btn-primary'
      : variant === 'outline'
      ? 'btn-outline'
      : variant === 'outline-white'
      ? 'btn-outline-white'
      : variant === 'secondary'
      ? 'btn-secondary'
      : variant === 'danger'
      ? 'btn-danger'
      : variant === 'quote'
      ? 'btn-quote-cta'
      : 'btn-accent';

  const sizeClass =
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  const widthClass = fullWidth ? 'btn-full' : '';

  const combinedClass = ['btn', variantClass, sizeClass, widthClass, className]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link
        to={to}
        id={id}
        title={title}
        className={combinedClass}
        onClick={onClick}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        id={id}
        title={title}
        className={combinedClass}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      id={id}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={combinedClass}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
