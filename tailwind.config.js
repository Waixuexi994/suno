/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          500: '#A64BFF',
          600: '#9333ea',
        },
        secondary: {
          500: '#1EC8FF',
          600: '#0ea5e9',
        },
        dark: {
          900: '#0E0F18',
          800: '#1a1b23',
          700: '#2a2b35',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(45deg, #A64BFF, #1EC8FF)',
        'gradient-card': 'linear-gradient(145deg, rgba(166, 75, 255, 0.1), rgba(30, 200, 255, 0.1))',
      }
    },
  },
  plugins: [],
};