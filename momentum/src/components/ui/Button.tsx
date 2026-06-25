import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-500 active:scale-[0.97] text-white border border-brand-500/50 shadow-lg shadow-brand-900/30',
  secondary: 'bg-surface-800 hover:bg-surface-700 active:scale-[0.97] text-surface-100 border border-surface-700',
  ghost: 'bg-transparent hover:bg-surface-800 active:scale-[0.97] text-surface-300 hover:text-surface-100 border border-transparent',
  danger: 'bg-red-600/20 hover:bg-red-600/30 active:scale-[0.97] text-red-400 border border-red-500/30',
  success: 'bg-emerald-600/20 hover:bg-emerald-600/30 active:scale-[0.97] text-emerald-400 border border-emerald-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
}
