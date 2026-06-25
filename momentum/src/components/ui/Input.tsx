import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

const inputBase = `
  w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-2.5 text-surface-100
  placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50
  transition-all duration-200 text-sm
`;

export function Input({ label, error, hint, leftIcon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-surface-300">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">{leftIcon}</span>
        )}
        <input
          className={`${inputBase} ${leftIcon ? 'pl-10' : ''} ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
      {hint && !error && <span className="text-xs text-surface-500">{hint}</span>}
    </div>
  );
}

export function Textarea({ label, error, hint, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-surface-300">{label}</label>}
      <textarea
        className={`${inputBase} resize-none ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''} ${className}`}
        rows={4}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
      {hint && !error && <span className="text-xs text-surface-500">{hint}</span>}
    </div>
  );
}

export function Select({ label, error, hint, children, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-surface-300">{label}</label>}
      <select
        className={`${inputBase} cursor-pointer ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
      {hint && !error && <span className="text-xs text-surface-500">{hint}</span>}
    </div>
  );
}
