/**
 * 2025-04-02
 * @author: @FL03
 * @description: the project logo component
 * @file: logo.tsx
 */
import { cn } from '@/lib/utils/cn';
import * as React from 'react';

type LogoProps = {
  background?: string;
  color?: string;
  height?: number | string;
  opacity?: string;
  width?: number | string;
};

/** The platform logo component */
export const AppLogo = React.forwardRef<
  SVGSVGElement,
  React.HTMLAttributes<SVGSVGElement> & LogoProps
>(
  (
    {
      background = '#ffffff',
      className,
      color = '#000000',
      height = '100%',
      opacity = '1',
      width = '100%',
      ...props
    },
    ref
  ) => {
    return (
      <svg
        ref={ref}
        className={cn(
          'h-8 w-8 rounded-full transition-all duration-200 ease-in-out tracking-tight',
          'hover:opacity-80 object-cover border-none',
          className
        )}
        enableBackground="new 0 0 496 496"
        role="img"
        height={height}
        opacity={opacity}
        viewBox="0 0 496 496"
        width={width}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect
          fill={background}
          opacity={opacity}
          rx="100%"
          width="100%"
          height="100%"
        />
        <g transform="matrix(3.1063, 0, 0, 3.144185, -464.773933, -495.105842)">
          <path
            fill={color}
            opacity={opacity}
            stroke={color}
            d="M 257.307 222.819 C 273.659 227.938 281.222 244.584 275.751 262.748 C 274.349 267.402 272.135 271.674 269.123 275.534 C 267.11 278.114 265.13 278.749 262.531 276.255 C 260.3 274.114 257.139 272.737 260.218 268.683 C 265.364 261.906 267.512 254.251 265.54 245.684 C 263.444 236.58 253.706 232.177 246.708 237.254 C 244.878 238.582 243.935 239.834 245.602 242.153 C 258.119 259.572 247.287 282.751 222.79 284.226 C 215.005 284.694 207.567 283.298 200.293 280.651 C 188.35 276.304 183.03 266.934 181.713 255.098 C 180.415 243.439 183.23 232.606 190.413 223.117 C 191.541 221.627 192.274 220.3 191.929 218.162 C 189.214 201.338 200.099 191.084 214.785 188.86 C 225.336 187.262 235.318 189.539 244.005 196.236 C 246.477 198.142 248.499 199.938 245.534 203.031 C 243.265 205.398 241.956 209.169 237.357 205.501 C 230.844 200.306 223.18 198.388 214.815 200.242 C 209.285 201.469 205.074 205.432 204.351 210.387 C 203.534 215.982 205.908 220.172 210.598 222.981 C 216.759 226.671 223.514 229.134 230.069 232.007 C 231.883 232.803 233.255 232.382 234.483 230.921 C 240.378 223.907 248.029 221.66 257.307 222.819 M 219.409 260.834 C 221.405 256.623 223.409 252.415 225.395 248.199 C 226.386 246.096 226.23 244.485 223.79 243.367 C 215.508 239.574 206.854 236.558 199.054 231.004 C 193.622 238.51 191.97 246.294 193.064 254.908 C 193.902 261.507 197.075 266.255 203.396 268.293 C 209.658 270.312 214.367 268.021 219.409 260.834 M 230.001 268.69 C 229.642 269.383 228.907 269.979 229.408 270.908 C 236.659 267.558 239.148 262.209 236.59 255.002 C 234.436 259.51 232.373 263.829 230.001 268.69 Z"
          />
        </g>
      </svg>
    );
  }
);
AppLogo.displayName = 'AppLogo';

export default AppLogo;
