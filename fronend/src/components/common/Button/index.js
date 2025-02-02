import React from 'react';

const Button = ({
  children,
  onClick,
  size = 'medium',
  className = '',
  type = 'button',
  disabled = false,
  variant = 'primary'
}) => {
  // Size classes configuration
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  // Variant classes configuration
  const variantClasses = {
    primary: 'bg-[#FFD200] text-[#2C2C2C] hover:bg-[#FFE566]',
    secondary: 'bg-white text-[#2C2C2C] border border-[#2C2C2C] hover:bg-gray-50',
    outline: 'bg-transparent border-2 border-white text-white hover:bg-white/10'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-lg
        font-bold
        transition-all
        duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-[1.02] active:scale-[0.98]'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Default props
Button.defaultProps = {
  size: 'medium',
  className: '',
  type: 'button',
  disabled: false,
  variant: 'primary'
};

export default Button;