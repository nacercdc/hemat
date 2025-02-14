import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

import base from "./base";

export default {
    darkMode: ["class"],
    content: base.content,
  presets: [base],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'100': 'hsl(var(--color-primary-100))',
  				'200': 'hsl(var(--color-primary-200))',
  				'300': 'hsl(var(--color-primary-300))',
  				'400': 'hsl(var(--color-primary-400))',
  				'500': 'hsl(var(--color-primary-500))',
  				'600': 'hsl(var(--color-primary-600))',
  				'700': 'hsl(var(--color-primary-700))',
  				'800': 'hsl(var(--color-primary-800))',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				'100': 'hsl(var(--color-destructive-100))',
  				'200': 'hsl(var(--color-destructive-200))',
  				'300': 'hsl(var(--color-destructive-300))',
  				'400': 'hsl(var(--color-destructive-400))',
  				'500': 'hsl(var(--color-destructive-500))',
  				'600': 'hsl(var(--color-destructive-600))',
  				'700': 'hsl(var(--color-destructive-700))',
  				'800': 'hsl(var(--color-destructive-800))',
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			basic: {
  				'100': 'hsl(var(--color-basic-100))',
  				'200': 'hsl(var(--color-basic-200))',
  				'300': 'hsl(var(--color-basic-300))',
  				'400': 'hsl(var(--color-basic-400))',
  				'500': 'hsl(var(--color-basic-500))',
  				'600': 'hsl(var(--color-basic-600))',
  				'700': 'hsl(var(--color-basic-700))',
  				'800': 'hsl(var(--color-basic-800))',
  				'900': 'hsl(var(--color-basic-900))',
  				'1000': 'hsl(var(--color-basic-1000))',
  				DEFAULT: 'hsl(var(--color-basic-1100))'
  			},
  			success: {
  				'100': 'hsl(var(--color-success-100))',
  				'200': 'hsl(var(--color-success-200))',
  				'300': 'hsl(var(--color-success-300))',
  				'400': 'hsl(var(--color-success-400))',
  				'500': 'hsl(var(--color-success-500))',
  				'600': 'hsl(var(--color-success-600))',
  				'700': 'hsl(var(--color-success-700))',
  				'800': 'hsl(var(--color-success-800))',
  				DEFAULT: 'hsl(var(--color-success-900))'
  			},
  			info: {
  				'100': 'hsl(var(--color-info-100))',
  				'200': 'hsl(var(--color-info-200))',
  				'300': 'hsl(var(--color-info-300))',
  				'400': 'hsl(var(--color-info-400))',
  				'500': 'hsl(var(--color-info-500))',
  				'600': 'hsl(var(--color-info-600))',
  				'700': 'hsl(var(--color-info-700))',
  				'800': 'hsl(var(--color-info-800))',
  				DEFAULT: 'hsl(var(--color-info-900))'
  			},
  			warning: {
  				'100': 'hsl(var(--color-warning-100))',
  				'200': 'hsl(var(--color-warning-200))',
  				'300': 'hsl(var(--color-warning-300))',
  				'400': 'hsl(var(--color-warning-400))',
  				'500': 'hsl(var(--color-warning-500))',
  				'600': 'hsl(var(--color-warning-600))',
  				'700': 'hsl(var(--color-warning-700))',
  				'800': 'hsl(var(--color-warning-800))',
  				DEFAULT: 'hsl(var(--color-warning-900))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderColor: {
  			DEFAULT: 'hsl(var(--border))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	},
  	fontFamily: {
  		poppins: 'var(--font-family)'
  	}
  },
  plugins: [animate],
} satisfies Config;
