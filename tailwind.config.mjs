/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Geist"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        pixel: ['var(--font-geist-pixel-grid)', '"Geist Mono"', 'monospace'],
      },
      colors: {
        orange: {
          50: '#101010',
          100: '#1a1a1a',
          200: '#252525',
          300: '#3a3a3a',
          400: '#565656',
          500: '#7a7a7a',
          600: '#a1a1a1',
          700: '#c3c3c3',
          800: '#e2e2e2',
          900: '#f5f5f5',
        },
        blue: {
          50: '#0f0f0f',
          100: '#191919',
          200: '#242424',
          300: '#373737',
          400: '#525252',
          500: '#767676',
          600: '#9e9e9e',
          700: '#c1c1c1',
          800: '#e0e0e0',
          900: '#f2f2f2',
        },
        gray: {
          500: '#b8b8b8',
          700: '#e4e4e4',
          800: '#f0f0f0',
        },
        'apple-gray': {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#86868b',
          400: '#6e6e73',
          500: '#1d1d1f',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce-slow 1s ease-in-out infinite',
        'pulse-bounce': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, bounce-slow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
