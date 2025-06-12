import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  const Component = motion.div;

  return (
    <Component
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : undefined}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </Component>
  );
};

export default Card;