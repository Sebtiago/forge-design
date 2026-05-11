import React from 'react';

export interface ButtonLogoProps {
  mode?: 'light' | 'dark';
  style?: 'glass' | 'outline' | 'flat';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const SIZE: Record<string, { px: string; icon: string }> = {
  sm: { px: 'w-7 h-7',  icon: 'w-4 h-4' },
  md: { px: 'w-8 h-8',  icon: 'w-4 h-4' },
  lg: { px: 'w-9 h-9',  icon: 'w-4 h-4' },
  xl: { px: 'w-11 h-11', icon: 'w-6 h-6' },
};

const STYLE: Record<string, Record<string, string>> = {
  glass: {
    light: 'bg-gradient-to-b from-white/60 to-white/50 border-2 border-white/90 text-black shadow-[0_1px_0_rgba(0,0,0,.05),0_4px_4px_rgba(0,0,0,.05),0_10px_10px_rgba(0,0,0,.1)] backdrop-blur-[10px]',
    dark:  'bg-black/50 border-2 border-white/90 text-white shadow-[0_1px_0_rgba(0,0,0,.05),0_4px_4px_rgba(0,0,0,.05),0_10px_10px_rgba(0,0,0,.1)] backdrop-blur-[10px]',
  },
  outline: {
    light: 'bg-white/60 border-2 border-white/50 text-black shadow-[0_1px_0_rgba(0,0,0,.05),0_4px_4px_rgba(0,0,0,.05),0_10px_10px_rgba(0,0,0,.1)] backdrop-blur-[10px]',
    dark:  'bg-white/60 border-2 border-white/50 text-black shadow-[0_1px_0_rgba(0,0,0,.05),0_4px_4px_rgba(0,0,0,.05),0_10px_10px_rgba(0,0,0,.1)] backdrop-blur-[10px]',
  },
  flat: {
    light: 'bg-white/60 text-black backdrop-blur-[10px]',
    dark:  'bg-white/60 text-black backdrop-blur-[10px]',
  },
};

const FigmaLogo = () => (
  <svg viewBox="0 0 16 16" fill="none" className="w-full h-full">
    <path d="M5.5 2H8v3.5H5.5A1.75 1.75 0 1 1 5.5 2Z" fill="#F24E1E"/>
    <path d="M8 2h2.5a1.75 1.75 0 1 1 0 3.5H8V2Z" fill="#FF7262"/>
    <path d="M8 5.5h2.5a1.75 1.75 0 1 1 0 3.5H8V5.5Z" fill="#A259FF"/>
    <path d="M5.5 5.5H8V9H5.5A1.75 1.75 0 1 1 5.5 5.5Z" fill="#0ACF83"/>
    <circle cx="9.75" cy="10.75" r="1.75" fill="#1ABCFE"/>
  </svg>
);

export function ButtonLogo({
  mode = 'light',
  style = 'glass',
  size = 'md',
  icon,
  disabled = false,
  onClick,
  className,
}: ButtonLogoProps) {
  const s = SIZE[size] || SIZE.md;
  const variant = STYLE[style]?.[mode] || STYLE.glass.light;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'relative inline-flex items-center justify-center rounded-full cursor-pointer transition-all duration-150',
        s.px,
        variant,
        disabled ? 'opacity-40 pointer-events-none' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <span className={['relative z-10 flex items-center justify-center', s.icon].join(' ')}>
        {icon ?? <FigmaLogo />}
      </span>
    </button>
  );
}
