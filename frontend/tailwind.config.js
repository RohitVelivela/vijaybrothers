/** @type {import('tailwindcss').Config} */

export default {
  content: [
   "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",   // harmless if not using app/
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        'cinzel': ['Cinzel', 'serif'],
        'lora': ['Lora', 'serif'],
        'work-sans': ['Work Sans', 'sans-serif'],
      },
      colors: {
        'zari-gold': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        'silk-ivory': {
          50: '#fefdfb',
          100: '#fef7f0',
          200: '#feeee0',
          300: '#fde0c7',
          400: '#fbcba4',
          500: '#f8b179',
          600: '#f4934c',
          700: '#f0752a',
          800: '#ec5a0a',
          900: '#d14d07',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        'nav-text-color': '#242424',
        'nav-hover-color': '#c62828',
      },
      backgroundSize: {
        'silk': '20px 20px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'ornate': '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'zari': '0 10px 25px -5px rgba(251, 191, 36, 0.3), 0 10px 10px -5px rgba(251, 191, 36, 0.04)',
      },
      backgroundImage: {
        'silk-texture': 'linear-gradient(45deg, #fef7f0 25%, transparent 25%), linear-gradient(-45deg, #fef7f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fef7f0 75%), linear-gradient(-45deg, transparent 75%, #fef7f0 75%)',
      }
    }
  },
  safelist: [
    { pattern: /bg-(red|green|blue|amber|emerald)-(100|200|300|400|500|600|700)/ },
    { pattern: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl)/ },
    { pattern: /grid-cols-(1|2|3|4|5|6|12)/ },
  ],
  plugins: [],
};