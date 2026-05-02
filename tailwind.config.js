export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
      colors: {
        primary: {
          50: '#FDF0D5',
          100: '#FDF0D5',
          200: '#FAD98A',
          300: '#FAD98A',
          400: '#F5A623',
          500: '#F5A623',
          600: '#C47D0E',
          700: '#C47D0E',
          800: '#C47D0E',
          900: '#C47D0E',
        },
        sage: {
          100: '#E0EAE0',
          300: '#96B896',
          500: '#5A845A',
          900: '#2F4F2F',
        },
        editorial: {
          50: '#FDFAF6',
          100: '#F5EFE4',
          200: '#E8D9C4',
          400: '#B5AD9F',
          500: '#6B6456',
          600: '#8C6A3F',
          900: '#1C1A14',
        },
        danger: '#C0392B',
        warning: '#E67E22',
        info: '#2980B9',
        dark: '#1C1A14',
      }
    },
  },
  plugins: [],
}
