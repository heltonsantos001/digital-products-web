/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: {
            DEFAULT: '#0F2942',
            50: '#F0F4F8',
            100: '#D9E2EC',
            200: '#BCCCDC',
            300: '#9FB3C8',
            700: '#1B365D',
            800: '#0F2942',
            900: '#0A1C2E',
          },
          ice: {
            DEFAULT: '#DDF4FF',
            50: '#F2FAFF',
            100: '#E6F6FF',
            200: '#DDF4FF',
            300: '#BAE6FD',
            400: '#7DD3FC',
          },
          yellow: {
            DEFAULT: '#F59E0B',
            light: '#FEF08A',
            hover: '#D97706',
            bright: '#FACC15',
          },
          pink: {
            DEFAULT: '#F43F5E',
            light: '#FFE4E6',
            accent: '#EC4899',
            badge: '#FDA4AF',
          },
          purple: {
            DEFAULT: '#7C3AED',
            light: '#EDE9FE',
            accent: '#8B5CF6',
          },
          green: {
            DEFAULT: '#10B981',
            light: '#D1FAE5',
            dark: '#047857',
          }
        }
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(15, 41, 66, 0.08)',
        'float': '0 15px 35px -5px rgba(15, 41, 66, 0.15)',
        'candy': '0 6px 0px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
