declare module 'react-toggle-dark-mode' {
  import * as React from 'react';

  export interface AnimationProperties {
    dark?: {
      circle?: {
        r?: number;
      };
      mask?: {
        cx?: string;
        cy?: string;
      };
      svg?: {
        transform?: string;
      };
      lines?: {
        opacity?: number;
      };
    };
    light?: {
      circle?: {
        r?: number;
      };
      mask?: {
        cx?: string;
        cy?: string;
      };
      svg?: {
        transform?: string;
      };
      lines?: {
        opacity?: number;
      };
    };
    springConfig?: {
      mass?: number;
      tension?: number;
      friction?: number;
    };
  }

  export const defaultProperties: AnimationProperties;

  export interface DarkModeSwitchProps
    extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    size?: number | string;
    animationProperties?: AnimationProperties;
    moonColor?: string;
    sunColor?: string;
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }

  export const DarkModeSwitch: React.FC<DarkModeSwitchProps>;
}
