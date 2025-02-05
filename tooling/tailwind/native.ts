/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Config } from "tailwindcss";
// @ts-expect-error - no types
import nativewind from "nativewind/preset";
import base from "./base";

const { hairlineWidth, platformSelect } = require("nativewind/theme");

export default {
  content: base.content,
  presets: [base, nativewind],
  theme: {
    extend: {
      colors: {
        border: withOpacity('border'),
        input: withOpacity('input'),
        ring: withOpacity('ring'),
        background: withOpacity('background'),
        foreground: withOpacity('foreground'),
        primary: {
          DEFAULT: withOpacity('primary'),
          foreground: withOpacity('primary-foreground'),
        },
        secondary: {
          DEFAULT: withOpacity('secondary'),
          foreground: withOpacity('secondary-foreground'),
        },
        destructive: {
          DEFAULT: withOpacity('destructive'),
          foreground: withOpacity('destructive-foreground'),
        },
        muted: {
          DEFAULT: withOpacity('muted'),
          foreground: withOpacity('muted-foreground'),
        },
        accent: {
          DEFAULT: withOpacity('accent'),
          foreground: withOpacity('accent-foreground'),
        },
        popover: {
          DEFAULT: withOpacity('popover'),
          foreground: withOpacity('popover-foreground'),
        },
        card: {
          DEFAULT: withOpacity('card'),
          foreground: withOpacity('card-foreground'),
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      fontFamily: {
        regular: "var(--font-family-regular)",
        thin: "var(--font-family-thin)",
        extraLight: "var(--font-family-extraLight)",
        light: "var(--font-family-light)",
        medium: "var(--font-family-medium)",
        bold: "var(--font-family-bold)",
        semiBold: "var(--font-family-semiBold)",
        extraBold: "var(--font-family-extraBold)"
      }
    },
  },
  plugins: [],
} satisfies Config;;

interface WithOpacityCallback {
  opacityValue?: number;
}
function withOpacity(variableName: string) {
  const callback = ({ opacityValue }: WithOpacityCallback) => {
    if (opacityValue !== undefined) {
      return platformSelect({
        ios: `rgb(var(--${variableName}) / ${opacityValue})`,
        android: `rgb(var(--android-${variableName}) / ${opacityValue})`,
      }) as string;
    }
    return platformSelect({
      ios: `rgb(var(--${variableName}))`,
      android: `rgb(var(--android-${variableName}))`,
    }) as string;
  };
  return callback as unknown as string;
}