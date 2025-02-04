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
        border: withOSDependentOpacity("border"),
        input: withOSDependentOpacity("input"),
        ring: withOSDependentOpacity("ring"),
        background: withOSDependentOpacity("background"),
        foreground: withOSDependentOpacity("foreground"),
        primary: {
          DEFAULT: withOSDependentOpacity("primary"),
          foreground: withOSDependentOpacity("primary-foreground"),
          800: withOSIndependentOpacity("color-primary-800"),
          700: withOSIndependentOpacity("color-primary-700"),
          600: withOSIndependentOpacity("color-primary-600"),
          500: withOSIndependentOpacity("color-primary-500"),
          400: withOSIndependentOpacity("color-primary-400"),
          300: withOSIndependentOpacity("color-primary-300"),
          200: withOSIndependentOpacity("color-primary-200"),
          100: withOSIndependentOpacity("color-primary-100"),
        },
        secondary: {
          DEFAULT: withOSDependentOpacity("secondary"),
          foreground: withOSDependentOpacity("secondary-foreground"),
        },
        destructive: {
          DEFAULT: withOSDependentOpacity("destructive"),
          foreground: withOSDependentOpacity("destructive-foreground"),
          800: withOSIndependentOpacity("color-destructive-800"),
          700: withOSIndependentOpacity("color-destructive-700"),
          600: withOSIndependentOpacity("color-destructive-600"),
          500: withOSIndependentOpacity("color-destructive-500"),
          400: withOSIndependentOpacity("color-destructive-400"),
          300: withOSIndependentOpacity("color-destructive-300"),
          200: withOSIndependentOpacity("color-destructive-200"),
          100: withOSIndependentOpacity("color-destructive-100"),
        },
        muted: {
          DEFAULT: withOSDependentOpacity("muted"),
          foreground: withOSDependentOpacity("muted-foreground"),
        },
        accent: {
          DEFAULT: withOSDependentOpacity("accent"),
          foreground: withOSDependentOpacity("accent-foreground"),
        },
        popover: {
          DEFAULT: withOSDependentOpacity("popover"),
          foreground: withOSDependentOpacity("popover-foreground"),
        },
        card: {
          DEFAULT: withOSDependentOpacity("card"),
          foreground: withOSDependentOpacity("card-foreground"),
        },

        basic: {
          DEFAULT: withOSIndependentOpacity("color-basic-1100"),
          1000: withOSIndependentOpacity("color-basic-1000"),
          900: withOSIndependentOpacity("color-basic-900"),
          800: withOSIndependentOpacity("color-basic-800"),
          700: withOSIndependentOpacity("color-basic-700"),
          600: withOSIndependentOpacity("color-basic-600"),
          500: withOSIndependentOpacity("color-basic-500"),
          400: withOSIndependentOpacity("color-basic-400"),
          300: withOSIndependentOpacity("color-basic-300"),
          200: withOSIndependentOpacity("color-basic-200"),
          100: withOSIndependentOpacity("color-basic-100"),
        },
        success: {
          DEFAULT: withOSIndependentOpacity("color-success-900"),
          800: withOSIndependentOpacity("color-success-800"),
          700: withOSIndependentOpacity("color-success-700"),
          600: withOSIndependentOpacity("color-success-600"),
          500: withOSIndependentOpacity("color-success-500"),
          400: withOSIndependentOpacity("color-success-400"),
          300: withOSIndependentOpacity("color-success-300"),
          200: withOSIndependentOpacity("color-success-200"),
          100: withOSIndependentOpacity("color-success-100"),
        },
        info: {
          DEFAULT: withOSIndependentOpacity("color-info-900"),
          800: withOSIndependentOpacity("color-info-800"),
          700: withOSIndependentOpacity("color-info-700"),
          600: withOSIndependentOpacity("color-info-600"),
          500: withOSIndependentOpacity("color-info-500"),
          400: withOSIndependentOpacity("color-info-400"),
          300: withOSIndependentOpacity("color-info-300"),
          200: withOSIndependentOpacity("color-info-200"),
          100: withOSIndependentOpacity("color-info-100"),
        },
        warning: {
          DEFAULT: withOSIndependentOpacity("color-warning-900"),
          800: withOSIndependentOpacity("color-warning-800"),
          700: withOSIndependentOpacity("color-warning-700"),
          600: withOSIndependentOpacity("color-warning-600"),
          500: withOSIndependentOpacity("color-warning-500"),
          400: withOSIndependentOpacity("color-warning-400"),
          300: withOSIndependentOpacity("color-warning-300"),
          200: withOSIndependentOpacity("color-warning-200"),
          100: withOSIndependentOpacity("color-warning-100"),
        },
      },
      borderWidth: hairlineWidth(),
    },
  },
} satisfies Config;

interface WithOpacityCallback {
  opacityValue?: number;
}
function withOSDependentOpacity(variableName: string) {
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

function withOSIndependentOpacity(variableName: string) {
  const callback = ({ opacityValue }: WithOpacityCallback) => {
    if (opacityValue !== undefined) {
      return `rgb(var(--${variableName}) / ${opacityValue})`;
    }else{
      return `rgb(var(--${variableName}))`
    }
  };
  return callback as unknown as string;
}