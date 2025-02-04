import type { VariantProps} from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { UITextView } from 'react-native-uitextview';
import { cn } from '../../../utils/cn.util';
export type TextProps = React.ComponentPropsWithoutRef<typeof UITextView> & VariantProps<typeof textVariants>
cssInterop(UITextView, { className: 'style' });

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      largeTitle: 'text-4xl',
      title1: 'text-2xl',
      title2: 'text-[22px] leading-7',
      title3: 'text-xl',
      heading: 'text-[17px] leading-6 font-semibold',
      body: 'text-[17px] leading-6',
      callout: 'text-base',
      subhead: 'text-[15px] leading-6',
      footnote: 'text-[13px] leading-5',
      caption1: 'text-xs',
      caption2: 'text-[11px] leading-4',
    },
    color: {
      primary: 'text-primary',
      secondary: 'text-secondary-foreground/90',
      tertiary: 'text-muted-foreground/90',
      success: "text-success-800",
      info: "text-info",
      destructive: "text-destructive",
      warning: "text-warning",
      quarternary: 'text-muted-foreground/50',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: null,
  },
});

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  variant,
  color,
  ...props
}: React.ComponentPropsWithoutRef<typeof UITextView> & VariantProps<typeof textVariants>) {
  const textClassName = React.useContext(TextClassContext);
  return (
    <UITextView
      className={cn(textVariants({ variant, color }), textClassName, className)}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
