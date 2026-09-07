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
        toon: {
          bg: '#0B0B10',
          dark: '#0E0E14',
          card: '#14141E',
          'card-hover': '#1A1A28',
          'card-inner': '#181824',
          border: '#242436',
          'border-light': '#32324A',
          lime: '#CCFF00',
          'lime-hover': '#D9FF33',
          purple: '#8A2BE2',
          'purple-light': '#A855F7',
          cyan: '#00F0FF',
          pink: '#FF3366',
          yellow: '#FFD600',
          orange: '#FF7A00',
        },
        background: '#0B0B10',
        surface: {
          50: '#FFFFFF',
          100: '#1A1A28',
          200: '#181824',
          700: '#242436',
          800: '#14141E',
          900: '#0B0B10',
        },
      },
      boxShadow: {
        'toon-lime': '0 0 25px rgba(204, 255, 0, 0.25)',
        'toon-purple': '0 0 30px rgba(138, 43, 226, 0.3)',
        'toon-card': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
        'toon-glow': '0 0 40px -10px rgba(204, 255, 0, 0.15)',
        'brutal-sm': '2px 2px 0px #CCFF00',
        'brutal': '4px 4px 0px #CCFF00',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        display: ['Outfit', 'Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
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
