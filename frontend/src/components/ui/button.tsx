import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-xs sm:text-sm font-sans font-bold uppercase tracking-wider transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#FF1E2D] hover:bg-[#FF3B48] text-white border-2 border-neutral-950 dark:border-white shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000000] dark:hover:shadow-[5px_5px_0px_0px_#FFFFFF]",
        neutral:
          "bg-white dark:bg-[#121017] text-neutral-950 dark:text-white border-2 border-neutral-950 dark:border-neutral-700 shadow-[4px_4px_0px_0px_#000000] dark:shadow-[4px_4px_0px_0px_#FF1E2D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_#000000] dark:hover:shadow-[5px_5px_0px_0px_#FF1E2D]",
        noShadow:
          "bg-[#FF1E2D] text-white border-2 border-neutral-950 dark:border-white hover:bg-[#FF3B48]",
        reverse:
          "bg-neutral-950 text-white border-2 border-neutral-800 hover:border-[#FF1E2D] hover:shadow-[4px_4px_0px_0px_#FF1E2D]",
        outline:
          "bg-transparent text-neutral-950 dark:text-white border-2 border-neutral-950 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 shadow-[3px_3px_0px_0px_#000000] dark:shadow-[3px_3px_0px_0px_#FF1E2D]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        xs: "h-8 gap-1.5 px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-sm",
        icon: "size-10",
        "icon-xs": "size-8 [&_svg]:size-3.5",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
