/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rigforge': {
          'black': '#0A0A0A',
          'white': '#F5F5F5',
          'red': '#E31B23',
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
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'brutalist': '2px',
      },
    },
  },
  plugins: [],
}
