/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // semantic palette — kept small on purpose
        brand: {
          50: '#eef4ff',
          100: '#dae6ff',
          200: '#bcd0ff',
          300: '#8fb1ff',
          400: '#5b88ff',
          500: '#3563ff',
          600: '#2148e6',
          700: '#1c39b8',
          800: '#1c3290',
          900: '#1d2f73',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
