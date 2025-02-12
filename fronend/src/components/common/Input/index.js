import React from 'react';

const Input = React.forwardRef(({ 
  type = 'text',
  className = '',
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        className={`
          w-full
          px-4
          py-2
          border
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-yellow-400
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };