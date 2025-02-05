import type { ComponentPropsWithoutRef } from 'react';
import React from 'react';
import { TextField as NWTextField } from '../../../nativewindui/components/textfield';
import type { VariantProps } from 'class-variance-authority';
import { cva  } from 'class-variance-authority';
import { cn } from '../../../nativewindui/lib/cn.util';

const textfieldVariants = cva(['border border-gray-300 rounded-md'], {
  variants: {
    size: {
      sm: 'h-9 px-2 text-sm',
      md: 'h-11 px-3 text-base',
      lg: 'h-13 px-4 text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type Props = ComponentPropsWithoutRef<typeof NWTextField> & VariantProps<typeof textfieldVariants>;

export const TextField = ({ size, className, ...rest }: Props) => {
  return <NWTextField {...rest} className={cn(textfieldVariants({ size }), className)} />;
};
