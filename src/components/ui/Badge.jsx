import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Badge = React.forwardRef(({
  className,
  variant = 'default',
  size = 'md',
  pulse = false,
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    primary: 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300',
    success: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
    danger: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    info: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    available: 'status-available text-white',
    occupied: 'status-occupied text-white',
    maintenance: 'status-maintenance text-white',
    overdue: 'status-overdue text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <motion.span
      ref={ref}
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse',
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      {...props}
    >
      {pulse && variant === 'danger' && (
        <span className="absolute -inset-1 rounded-full bg-red-400 opacity-75 animate-ping"></span>
      )}
      <span className="relative">{children}</span>
    </motion.span>
  );
});

Badge.displayName = 'Badge';

export default Badge;