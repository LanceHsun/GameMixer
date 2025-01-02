import React from 'react';

const GradientButton = ({
  children,
  onClick,
  size = 'medium',
  className = '',
  type = 'button',
  disabled = false
}) => {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-8 py-3 text-lg',
    large: 'px-10 py-4 text-xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        rounded-xl
        font-bold
        tracking-wider
        text-white
        bg-gradient-to-r 
        from-indigo-400/70 
        to-blue-400/70
        backdrop-blur-md
        border-2
        border-white/40
        shadow-lg
        transition-all
        duration-300
        hover:shadow-xl
        hover:scale-105
        hover:from-indigo-300/80 
        hover:to-blue-300/80
        active:scale-95
        disabled:opacity-50
        disabled:hover:scale-100
        disabled:hover:shadow-none
        group
        relative
        overflow-hidden
        ${className}
      `}
    >
      <span className="relative z-10 font-bold tracking-wider uppercase drop-shadow-lg">
        {children}
      </span>
      <div className="
        absolute 
        inset-0 
        bg-gradient-to-r 
        from-purple-400/40 
        to-pink-400/40 
        opacity-0 
        group-hover:opacity-100 
        transition-opacity 
        duration-300
      "></div>
    </button>
  );
};

// 添加 PropTypes （可选，但推荐）
GradientButton.defaultProps = {
  size: 'medium',
  className: '',
  type: 'button',
  disabled: false
};

// 导出组件
export default GradientButton;