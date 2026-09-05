import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'ghost' | 'flat' | 'light';
  color?: 'default' | 'danger' | 'primary' | 'muted';
}

const sizeClasses = {
  sm: 'w-7 h-7 p-1 text-xs',
  md: 'w-8 h-8 p-1.5 text-sm',
  lg: 'w-10 h-10 p-2 text-base',
};

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const variantClasses = {
  solid: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700',
  ghost: 'bg-transparent hover:bg-neutral-800/80 text-neutral-400 hover:text-white',
  flat: 'bg-neutral-900/90 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-500/50',
  light: 'bg-neutral-950/60 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800/60',
};

const colorClasses = {
  default: '',
  danger: 'hover:bg-red-600 hover:text-white hover:border-red-500 text-neutral-400',
  primary: 'hover:bg-red-600 hover:text-white text-neutral-400',
  muted: 'text-neutral-500 hover:text-neutral-200',
};

export const CloseButton: React.FC<CloseButtonProps> = ({
  size = 'md',
  variant = 'flat',
  color = 'default',
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-150 active:scale-95 focus:outline-none cursor-pointer shrink-0',
        sizeClasses[size],
        variantClasses[variant],
        colorClasses[color],
        className
      )}
      {...props}
    >
      <X className={iconSizes[size]} />
    </button>
  );
};

export default CloseButton;
