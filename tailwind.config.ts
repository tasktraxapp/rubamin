import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        copper: {
          DEFAULT: '#C87533',
          dark: '#B86A2F',
          light: '#FFF5F0',
        },
        charcoal: {
          DEFAULT: '#2C3E50',
          dark: '#1F2937',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
