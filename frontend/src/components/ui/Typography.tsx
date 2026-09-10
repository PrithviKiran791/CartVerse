import React from 'react';
import { cn } from '../../lib/utils';

export type TypographyType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'lead'
  | 'body'
  | 'body-sm'
  | 'code'
  | 'label';

export type TypographyColor =
  | 'default'
  | 'muted'
  | 'primary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'white';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  type?: TypographyType;
  color?: TypographyColor;
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}

const defaultElementMap: Record<TypographyType, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  lead: 'p',
  body: 'p',
  'body-sm': 'p',
  code: 'code',
  label: 'span',
};

const defaultStyleMap: Record<TypographyType, string> = {
  h1: 'font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 dark:text-white uppercase',
  h2: 'font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-neutral-900 dark:text-white',
  h3: 'font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100',
  h4: 'font-semibold text-lg text-neutral-800 dark:text-neutral-200',
  h5: 'font-semibold text-base text-neutral-800 dark:text-neutral-200',
  h6: 'font-medium text-sm text-neutral-700 dark:text-neutral-300',
  lead: 'text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed',
  body: 'text-base text-neutral-600 dark:text-neutral-300 leading-relaxed',
  'body-sm': 'text-sm text-neutral-500 dark:text-neutral-400 leading-normal',
  code: 'font-mono text-xs bg-neutral-100 dark:bg-neutral-900 text-red-600 dark:text-red-400 border border-neutral-300 dark:border-neutral-800 px-2 py-1 rounded inline-block',
  label: 'text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400',
};

const colorMap: Record<TypographyColor, string> = {
  default: '',
  muted: 'text-neutral-500 dark:text-neutral-400',
  primary: 'text-red-600 dark:text-red-500',
  danger: 'text-red-600 dark:text-red-500',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  white: 'text-white',
};

export const Typography: React.FC<TypographyProps> = ({
  type = 'body',
  color = 'default',
  as,
  className,
  children,
  ...props
}) => {
  const Component = as || defaultElementMap[type] || 'p';
  const typeStyle = defaultStyleMap[type] || defaultStyleMap.body;
  const colorStyle = colorMap[color] || '';

  return (
    <Component className={cn(typeStyle, colorStyle, className)} {...props}>
      {children}
    </Component>
  );
};

export default Typography;
