import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-full transition-all duration-300 flex items-center gap-2 justify-center font-heading';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#734425] to-[#5D361D] text-[#FAF6F2] hover:from-[#5D361D] hover:to-[#492B17] shadow-lg shadow-[#734425]/20 hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-[#FAF6F2] text-[#734425] border-2 border-[#734425] hover:bg-[#F5ECE4] shadow-md hover:shadow-lg',
    accent: 'bg-gradient-to-r from-[#C26819] to-[#A85712] text-white hover:from-[#A85712] hover:to-[#8C4410] shadow-lg shadow-[#C26819]/25 hover:shadow-xl hover:-translate-y-0.5',
    outline: 'bg-transparent text-[#734425] border-2 border-[#734425] hover:bg-[#734425] hover:text-[#FAF6F2] transition-all',
    ghost: 'bg-transparent text-[#2E2E2E] hover:bg-[#F5ECE4]',
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
