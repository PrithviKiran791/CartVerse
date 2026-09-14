import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-none border-2 border-neutral-950 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm font-sans text-neutral-950 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:outline-none focus-visible:border-[#FF1E2D] dark:focus-visible:border-[#FF1E2D] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-[2px_2px_0px_0px_#000000] dark:shadow-[2px_2px_0px_0px_#222222] focus:shadow-[3px_3px_0px_0px_#FF1E2D]',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

