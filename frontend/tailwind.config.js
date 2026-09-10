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
        'sans': ['var(--app-font-family)', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['var(--app-font-heading)', 'Space Grotesk', 'Inter', 'sans-serif'],
        'mono': ['var(--app-font-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'geist': ['Geist', 'sans-serif'],
        'plex-sans': ['IBM Plex Sans', 'sans-serif'],
        'plex-mono': ['IBM Plex Mono', 'monospace'],
        'space-mono': ['Space Mono', 'monospace'],
        'unbounded': ['Unbounded', 'sans-serif'],
      },
      borderRadius: {
        'brutalist': '2px',
      },
    },
  },
  plugins: [],
}
