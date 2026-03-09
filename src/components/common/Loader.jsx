import React from 'react';

/**
 * Premium Loader Component
 */
const Loader = ({ size = 'md', inline = false, variant = 'primary', label = 'Loading...', className = '' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-[3px]',
    lg: 'h-16 w-16 border-4'
  };

  const containerClass = inline
    ? `inline-flex items-center justify-center ${className}`
    : `flex min-h-[200px] w-full items-center justify-center ${className}`;

  const colors = {
    primary: 'border-surface-100 border-t-primary-500',
    secondary: 'border-surface-100 border-t-secondary-500',
    muted: 'border-surface-50 border-t-surface-200'
  };

  return (
    <div className={containerClass} role="status" aria-busy="true">
      <div
        className={`
          ${sizes[size] || sizes.md} 
          ${colors[variant] || colors.primary} 
          animate-spin rounded-full
        `}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Loader;

