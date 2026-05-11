import React from 'react';

/**
 * Card
 * Surface for grouping related content. Supports bordered and elevated variants.
 *
 * @example
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content here</Card.Body>
 * </Card>
 */

export interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={['px-6 py-4 border-b border-neutral-200', className].filter(Boolean).join(' ')}>
    {children}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className }) => (
  <div className={['px-6 py-4', className].filter(Boolean).join(' ')}>
    {children}
  </div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={['px-6 py-4 border-t border-neutral-200', className].filter(Boolean).join(' ')}>
    {children}
  </div>
);

const variantClasses: Record<string, string> = {
  default: 'bg-white border border-neutral-200 rounded-lg',
  bordered: 'bg-transparent border-2 border-neutral-200 rounded-lg',
  elevated: 'bg-white rounded-lg shadow-md',
};

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ variant = 'default', padding = 'none', children, className }) => {
  const classes = [variantClasses[variant], paddingClasses[padding], className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

Card.displayName = 'Card';
CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';
