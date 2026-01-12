'use client';

import React from 'react';
// import { cn } from '@repo/shadcn-ui/lib/utils';
import clsx from 'clsx';
const cn = clsx;

export interface TextRevealButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  revealColor?: string;
  strokeColor?: string;
}

export const TextRevealButton = React.forwardRef<
  HTMLButtonElement,
  TextRevealButtonProps
>(({
  text = "shadcn.io",
  revealColor = "#37FF8B",
  strokeColor = "rgba(100, 100, 100, 0.7)",
  className,
  style,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative cursor-pointer bg-transparent border-none p-0 m-0 h-auto font-['Arial'] uppercase",
        className
      )}
      style={{
        fontSize: '2em',
        letterSpacing: '3px',
        color: 'transparent',
        WebkitTextStroke: `1px ${strokeColor}`,
        ...style,
      }}
      {...(props as any)}
    >
      <span>
        &nbsp;{text}&nbsp;
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 w-0 overflow-hidden transition-all duration-500 group-hover:w-full group-hover:[filter:drop-shadow(0_0_23px_#37FF8B)]"
        style={{
          color: revealColor,
          borderRight: `6px solid ${revealColor}`,
          WebkitTextStroke: `1px ${revealColor}`,
        }}
      >
        &nbsp;{text}&nbsp;
      </span>
    </button>
  );
});

TextRevealButton.displayName = "TextRevealButton";