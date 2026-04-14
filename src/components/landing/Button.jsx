import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg',
    outline: 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-all',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
