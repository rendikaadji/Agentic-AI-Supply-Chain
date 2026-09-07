/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#080B11',
        surface: {
          50: '#F8FAFC',
          900: '#0F1626',
          800: '#141D30',
          700: '#1C2740',
          600: '#273656',
        },
        brand: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          blue: '#3B82F6',
          indigo: '#6366F1',
          violet: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'scanline': 'scan 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'laser': 'laser 2.5s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        laser: {
          '0%, 100%': { top: '0%' },
          '50%': { top: '96%' },
        }
      }
    },
  },
  plugins: [],
}
