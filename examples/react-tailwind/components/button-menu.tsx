import React from 'react';

export interface ButtonMenuProps {
  mode?: 'light' | 'dark';
  state?: 'normal' | 'hover' | 'selected';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  showGlow?: boolean;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const SIZE: Record<string, { text: string; padding: string; gap: string; icon: string }> = {
  sm: { text: 'text-[13px] leading-5', padding: 'px-3 py-1',    gap: 'gap-2', icon: 'w-4 h-4' },
  md: { text: 'text-[13px] leading-5', padding: 'px-4 py-1.5',  gap: 'gap-2', icon: 'w-4 h-4' },
  lg: { text: 'text-[14px] leading-5', padding: 'px-4 py-2',    gap: 'gap-3', icon: 'w-4 h-4' },
  xl: { text: 'text-[16px] leading-6', padding: 'px-5 py-2.5',  gap: 'gap-3', icon: 'w-6 h-6' },
};

const UserIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export function ButtonMenu({
  mode = 'light',
  state = 'normal',
  size = 'sm',
  text = 'Account',
  showGlow = true,
  showLeftIcon = false,
  showRightIcon = true,
  leftIcon,
  rightIcon,
  onClick,
  className,
}: ButtonMenuProps) {
  const s = SIZE[size] || SIZE.sm;
  const isLight = mode === 'light';
  const isSelected = state === 'selected';
  const isHover = state === 'hover';

  const textColor = isLight ? 'text-black' : 'text-white';

  const borderColor = isSelected
    ? isLight ? 'border-l-[#2670e9]' : 'border-l-white'
    : isHover
      ? isLight ? 'border-l-[#2670e9]' : 'border-l-white'
      : 'border-l-transparent';

  const bg = isSelected
    ? isLight
      ? 'bg-gradient-to-r from-[rgba(38,112,233,0.3)] to-transparent'
      : 'bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-transparent'
    : '';

  const glowColor = isSelected
    ? isLight ? 'bg-[#2670e9]' : 'bg-white'
    : '';

  return (
    <button
      onClick={onClick}
      className={[
        'relative inline-flex items-center border-l-2 transition-all duration-150 font-medium',
        s.text, s.padding, s.gap,
        textColor, borderColor, bg,
        className,
      ].filter(Boolean).join(' ')}
    >
      {showGlow && (
        <span
          className={[
            'absolute left-[-1px] top-0 bottom-0 w-[3px] blur-[5px]',
            isSelected ? glowColor : 'bg-current opacity-0',
          ].join(' ')}
        />
      )}

      {showLeftIcon && (
        <span className={['flex-shrink-0', s.icon].join(' ')}>
          {leftIcon ?? <UserIcon className={s.icon} />}
        </span>
      )}

      <span className="flex-1 min-w-0 text-left overflow-hidden text-ellipsis whitespace-nowrap">
        {text}
      </span>

      {showRightIcon && (
        <span className={['flex-shrink-0', s.icon].join(' ')}>
          {rightIcon ?? <UserIcon className={s.icon} />}
        </span>
      )}
    </button>
  );
}
