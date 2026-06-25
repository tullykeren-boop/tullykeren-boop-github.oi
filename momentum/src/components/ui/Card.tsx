import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className = '', hover = false, onClick, padding = 'md' }: CardProps) {
  const baseClass = `glass rounded-2xl ${paddings[padding]} ${className}`;

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className={`${baseClass} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClass}>{children}</div>;
}
