
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
}) => {
  const baseStyles = 'whitespace-nowrap cursor-pointer font-medium transition-all duration-300 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] hover:shadow-lg hover:scale-105',
    secondary: 'bg-[#2C3E50] text-white hover:bg-[#1F2937]',
    outline: 'border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
