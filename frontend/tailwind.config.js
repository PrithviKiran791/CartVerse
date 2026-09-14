/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cartverse': {
          'red': '#FF1E2D',
          'red-hover': '#FF3B48',
        },
        'rigforge': {
          'black': '#0A0A0A',
          'white': '#F5F5F5',
          'red': '#FF1E2D',
          'grey': {
            100: '#D0D0D0',
            200: '#A0A0A0',
            300: '#666666',
            400: '#2A2A2A',
            500: '#181818',
          },
        },
      },
      fontFamily: {
        'sans': ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        'display': ['Merriweather', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
