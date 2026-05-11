import React from 'react';

/**
 * Button
 * Primary interactive element. Use for the main action on a page or in a form.
 *
 * @example
 * <Button variant="primary" size="md">Submit</Button>
 */

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  className,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variantClasses: Record<string, string> = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-700 focus-visible:ring-neutral-900',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400',
    outline: 'border border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'h-8 px-3 text-sm rounded-md gap-1.5',
    md: 'h-10 px-4 text-sm rounded-lg gap-2',
    lg: 'h-12 px-6 text-base rounded-lg gap-2',
  };

  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? <span aria-hidden="true">···</span> : children}
    </button>
  );
};

Button.displayName = 'Button';
