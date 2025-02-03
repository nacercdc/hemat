import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

import base from "./base";

export default {
  content: base.content,
  presets: [base],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          800:"hsl(var(--color-primary-800))",
          700:"hsl(var(--color-primary-700))",
          600:"hsl(var(--color-primary-600))",
          500:"hsl(var(--color-primary-500))",
          400:"hsl(var(--color-primary-400))",
          300:"hsl(var(--color-primary-300))",
          200:"hsl(var(--color-primary-200))",
          100:"hsl(var(--color-primary-100))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          800:"hsl(var(--color-danger-800))",
          700:"hsl(var(--color-danger-700))",
          600:"hsl(var(--color-danger-600))",
          500:"hsl(var(--color-danger-500))",
          400:"hsl(var(--color-danger-400))",
          300:"hsl(var(--color-danger-300))",
          200:"hsl(var(--color-danger-200))",
          100:"hsl(var(--color-danger-100))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        basic:{
          DEFAULT:"hsl(var(--color-basic-1100))",
          1000:"hsl(var(--color-basic-1000))",
          900:"hsl(var(--color-basic-900))",
          800:"hsl(var(--color-basic-800))",
          700:"hsl(var(--color-basic-700))",
          600:"hsl(var(--color-basic-600))",
          500:"hsl(var(--color-basic-500))",
          400:"hsl(var(--color-basic-400))",
          300:"hsl(var(--color-basic-300))",
          200:"hsl(var(--color-basic-200))",
          100:"hsl(var(--color-basic-100))",
        },
     
        success:{
          DEFAULT:"hsl(var(--color-success-900))",
          800:"hsl(var(--color-success-800))",
          700:"hsl(var(--color-success-700))",
          600:"hsl(var(--color-success-600))",
          500:"hsl(var(--color-success-500))",
          400:"hsl(var(--color-success-400))",
          300:"hsl(var(--color-success-300))",
          200:"hsl(var(--color-success-200))",
          100:"hsl(var(--color-success-100))",
        },
        info:{
          DEFAULT:"hsl(var(--color-info-900))",
          800:"hsl(var(--color-info-800))",
          700:"hsl(var(--color-info-700))",
          600:"hsl(var(--color-info-600))",
          500:"hsl(var(--color-info-500))",
          400:"hsl(var(--color-info-400))",
          300:"hsl(var(--color-info-300))",
          200:"hsl(var(--color-info-200))",
          100:"hsl(var(--color-info-100))",
        },
        warning:{
          DEFAULT:"hsl(var(--color-warning-900))",
          800:"hsl(var(--color-warning-800))",
          700:"hsl(var(--color-warning-700))",
          600:"hsl(var(--color-warning-600))",
          500:"hsl(var(--color-warning-500))",
          400:"hsl(var(--color-warning-400))",
          300:"hsl(var(--color-warning-300))",
          200:"hsl(var(--color-warning-200))",
          100:"hsl(var(--color-warning-100))",
        }
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    fontFamily:{
      poppins:"var(--font-family)"
    },
  },
  plugins: [animate],
} satisfies Config;
