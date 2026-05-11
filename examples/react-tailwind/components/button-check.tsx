import React from 'react';

/**
 * ButtonCheck
 * Circular icon button used in feature lists (the minus/check indicator).
 * From the DesignCode UI kit — Text Check rows.
 *
 * @example
 * <ButtonCheck mode="light" style="glass" />
 * <ButtonCheck mode="dark" aria-label="Included feature" />
 */

export interface ButtonCheckProps {
  /** Light or dark surface context */
  mode?: 'light' | 'dark';
  /** Visual style variant */
  style?: 'glass' | 'outline' | 'flat';
  /** Size of the circular button */
  size?: 'sm' | 'md';
  /** Accessible label for screen readers */
  'aria-label'?: string;
  className?: string;
}

const containerSize = {
  sm: 'size-6',
  md: 'size-8',
};

const iconSize = {
  sm: 'size-3',
  md: 'size-4',
};

function getCircleClasses(mode: 'light' | 'dark', style: 'glass' | 'outline' | 'flat') {
  const base = 'absolute inset-[10%] rounded-full backdrop-blur-[10px]';

  if (mode === 'dark') {
    return `${base} bg-white/10 border border-white/20`;
  }

  if (style === 'glass') {
    return `${base} bg-black/5 border border-black/10`;
  }

  if (style === 'outline') {
    return `${base} bg-white/30 border border-black/10`;
  }

  // flat
  return `${base} bg-white/20 border border-black/5`;
}

function getLineColor(mode: 'light' | 'dark') {
  return mode === 'dark' ? 'bg-white/70' : 'bg-black/40';
}

export const ButtonCheck: React.FC<ButtonCheckProps> = ({
  mode = 'light',
  style = 'glass',
  size = 'md',
  'aria-label': ariaLabel = 'Included',
  className,
}) => {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={[
        'relative shrink-0',
        containerSize[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Circle background */}
      <div className={getCircleClasses(mode, style)} aria-hidden="true" />

      {/* Minus icon (horizontal line) */}
      <div
        aria-hidden="true"
        className={[
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          iconSize[size],
          'flex items-center justify-center',
        ].join(' ')}
      >
        <div className={['h-px w-3/4 rounded-full', getLineColor(mode)].join(' ')} />
      </div>
    </div>
  );
};

ButtonCheck.displayName = 'ButtonCheck';
