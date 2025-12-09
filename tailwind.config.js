/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfca',
          300: '#fcaea5',
          400: '#f87f71',
          500: '#f05545',
          600: '#dd3728',
          700: '#ba2b1e',
          800: '#9a281c',
          900: '#80271e',
        },
        misket: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          blue: '#3B82F6',
          green: '#10B981',
          yellow: '#F59E0B',
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

