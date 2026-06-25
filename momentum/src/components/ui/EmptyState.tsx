import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ emoji, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="text-6xl mb-6">{emoji}</div>
      <h3 className="text-xl font-semibold text-surface-200 mb-2">{title}</h3>
      <p className="text-surface-400 max-w-sm mb-8 text-sm leading-relaxed">{description}</p>
      {action}
    </motion.div>
  );
}
