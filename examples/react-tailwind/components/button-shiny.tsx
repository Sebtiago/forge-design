import React from 'react';

/**
 * ButtonShiny
 * Glass-morphism action button from the DesignCode UI kit.
 * Supports light/dark modes and glass/outline/flat styles.
 *
 * @example
 * <ButtonShiny>Preview in Figma</ButtonShiny>
 * <ButtonShiny mode="dark" style="glass" rightIcon={<FigmaLogo />}>Open</ButtonShiny>
 */

export interface ButtonShinyProps {
  /** Light or dark surface context */
  mode?: 'light' | 'dark';
  /** Visual style variant */
  style?: 'glass' | 'outline' | 'flat';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Show rainbow glow effect behind the button */
  showGlow?: boolean;
  /** Icon rendered before the label */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label */
  rightIcon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm:  'px-3 py-1.5 text-xs gap-1.5 rounded-md',
  md:  'px-4 py-1.5 text-[13px] gap-2 rounded-lg',
  lg:  'px-5 py-2.5 text-sm gap-2 rounded-xl',
};

function getButtonClasses(mode: 'light' | 'dark', style: 'glass' | 'outline' | 'flat') {
  const base = 'backdrop-blur-[10px] inline-flex items-center font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  if (mode === 'dark') {
    return `${base} bg-black/50 border-2 border-white text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] focus-visible:ring-white`;
  }

  if (style === 'glass') {
    return `${base} bg-gradient-to-b from-white/60 to-white/50 border-2 border-white text-black shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] focus-visible:ring-black/30`;
  }

  if (style === 'outline') {
    return `${base} bg-white/60 border-2 border-white/50 text-black shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] focus-visible:ring-black/30`;
  }

  // flat
  return `${base} bg-white/10 text-black focus-visible:ring-black/30`;
}

const GLOW_SVG = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111 52" preserveAspectRatio="none"><g transform="matrix(-2.58 4.3 -4.659 -2.3812 55.5 26)"><foreignObject x="-221.91" y="-221.91" width="443.81" height="443.81"><div xmlns="http://www.w3.org/1999/xhtml" style="background-image: conic-gradient(from 90deg, rgb(113,71,255) 0%, rgba(90,152,255,0.5) 13%, rgba(66,232,255,0) 26%, rgba(255,126,171,0.5) 51%, rgb(48,131,255) 76%, rgb(113,71,255) 100%); height:100%; width:100%;"></div></foreignObject></g></svg>')`;

export const ButtonShiny: React.FC<ButtonShinyProps> = ({
  mode = 'light',
  style = 'glass',
  size = 'md',
  showGlow = false,
  leftIcon,
  rightIcon,
  disabled = false,
  onClick,
  children,
  className,
}) => {
  const buttonClasses = [
    getButtonClasses(mode, style),
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="relative inline-flex flex-col items-start">
      <button
        type="button"
        className={buttonClasses}
        disabled={disabled}
        onClick={onClick}
        aria-disabled={disabled}
      >
        {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
        <span className="font-medium">{children}</span>
        {rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
      </button>

      {showGlow && (
        <div
          aria-hidden="true"
          className="absolute inset-[-10px] blur-[10px] mix-blend-screen opacity-30 rounded-lg pointer-events-none"
          style={{ backgroundImage: GLOW_SVG }}
        />
      )}
    </div>
  );
};

ButtonShiny.displayName = 'ButtonShiny';
