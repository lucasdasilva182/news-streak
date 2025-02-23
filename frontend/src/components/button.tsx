import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`flex gap-1 items-center justify-center bg-primary text-black font-extrabold h-9 min-w-20 px-4 py-2 rounded
        hover:bg-primary-light transition-colors text-sm ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
