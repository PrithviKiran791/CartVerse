import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 as CheckCircle2Icon } from 'lucide-react';

const alertVariants = cva(
  'relative w-full rounded-none border-2 px-4 py-3 text-sm grid has-[>svg]:grid-cols-[16px_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:w-4 [&>svg]:h-4 [&>svg]:translate-y-0.5 [&>svg]:text-current [&>svg]:shrink-0 transition-all font-sans',
  {
    variants: {
      variant: {
        default:
          'bg-white dark:bg-[#0E0C13] text-neutral-950 dark:text-white border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D]',
        destructive:
          'bg-[#FF1E2D] text-white border-neutral-950 dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] [&>svg]:text-white',
        success:
          'bg-emerald-400 dark:bg-[#071F14] text-neutral-950 dark:text-emerald-200 border-neutral-950 dark:border-emerald-500 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#10B981] [&>svg]:text-neutral-950 dark:[&>svg]:text-emerald-400',
        warning:
          'bg-amber-300 dark:bg-[#201805] text-neutral-950 dark:text-amber-200 border-neutral-950 dark:border-amber-500 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#F59E0B] [&>svg]:text-neutral-950 dark:[&>svg]:text-amber-400',
        info:
          'bg-cyan-300 dark:bg-[#051C22] text-neutral-950 dark:text-cyan-200 border-neutral-950 dark:border-cyan-500 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#06B6D4] [&>svg]:text-neutral-950 dark:[&>svg]:text-cyan-400',
        neutral:
          'bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-neutral-900 dark:border-neutral-700 shadow-[4px_4px_0px_0px_#000000]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 line-clamp-1 min-h-4 font-sans font-bold tracking-tight uppercase text-xs sm:text-sm',
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-xs sm:text-sm font-sans [&_p]:leading-relaxed opacity-90',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, CheckCircle2Icon };
