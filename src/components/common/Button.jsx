import React from 'react';

/**
 * Premium Reusable Button Component
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'} props.variant
 * @param {'sm' | 'md' | 'lg'} props.size
 * @param {boolean} props.isLoading
 * @param {React.ReactNode} props.icon
 * @param {'left' | 'right'} props.iconPosition
 * @param {boolean} props.fullWidth
 */
const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const isActuallyDisabled = disabled || isLoading;

  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-4 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary:
      'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-100 shadow-sm hover:shadow-md',
    secondary:
      'bg-white border border-surface-200 text-surface-900 hover:border-surface-300 hover:bg-surface-50 focus:ring-surface-100 shadow-sm',
    danger:
      'bg-danger text-white hover:bg-red-600 focus:ring-red-100 shadow-sm',
    ghost:
      'bg-transparent text-surface-600 hover:bg-surface-50 hover:text-surface-900 focus:ring-surface-100',
    outline:
      'bg-transparent border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-100',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm rounded-lg',
    md: 'h-11 px-5 text-base rounded-xl',
    // h-[52px] instead of invalid h-13
    lg: 'h-[52px] px-8 text-lg rounded-2xl',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  /* Spinner SVG */
  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-current flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      disabled={isActuallyDisabled}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${widthStyle}
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center gap-2">
        {/* Loading spinner replaces left icon */}
        {isLoading ? (
          <Spinner />
        ) : (
          icon && iconPosition === 'left' && (
            <span className="flex items-center">{icon}</span>
          )
        )}

        {/* Button label (always shown unless children is null) */}
        {children}

        {/* Right icon (hidden while loading) */}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="flex items-center">{icon}</span>
        )}
      </span>
    </button>
  );
};

export default Button;
