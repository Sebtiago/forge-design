import React from 'react';

/**
 * Input
 * Text input for forms. Includes label, hint, and error state support.
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, size = 'md', className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    const sizeClasses: Record<string, string> = {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-3 text-sm rounded-lg',
      lg: 'h-12 px-4 text-base rounded-lg',
    };

    const inputClasses = [
      'w-full border bg-white text-neutral-900 placeholder-neutral-400',
      'transition-colors outline-none',
      'focus:ring-2 focus:ring-neutral-900 focus:ring-offset-0 focus:border-neutral-900',
      'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400',
      error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-neutral-200',
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-900"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          {...props}
        />

        {hint && !error && (
          <span id={hintId} className="text-xs text-neutral-500">
            {hint}
          </span>
        )}

        {error && (
          <span id={errorId} className="text-xs text-red-600" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
