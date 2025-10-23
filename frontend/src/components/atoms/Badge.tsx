import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export interface BadgeProps {
  variant?: 'endangered' | 'vulnerable' | 'near-threatened' | 'least-concern' | 'data-deficient' | 'rank' | 'new' | 'default';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  pulse = false,
  glow = false,
  children,
  className,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200';

  const variants = {
    endangered: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
    vulnerable: 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    'near-threatened': 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    'least-concern': 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    'data-deficient': 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800',
    rank: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white border border-amber-500 shadow-lg',
    new: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border border-blue-400 shadow-lg',
    default: 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const glowStyles = glow ? {
    endangered: 'shadow-[0_0_15px_rgba(211,47,47,0.4)]',
    vulnerable: 'shadow-[0_0_15px_rgba(255,107,53,0.4)]',
    'near-threatened': 'shadow-[0_0_15px_rgba(255,215,0,0.4)]',
    'least-concern': 'shadow-[0_0_15px_rgba(76,175,80,0.4)]',
    rank: 'shadow-[0_0_20px_rgba(251,191,36,0.5)]',
    new: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    default: '',
    'data-deficient': '',
  }[variant] : '';

  const pulseAnimation = pulse ? {
    scale: [1, 1.05, 1],
    opacity: [1, 0.9, 1],
  } : {};

  return (
    <motion.span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        glowStyles,
        className
      )}
      animate={pulse ? pulseAnimation : {}}
      transition={pulse ? {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      } : {}}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
