/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        asphalt: '#121212',
        charcoal: '#1E1E1E',
        ash: '#9CA3AF',
        // Primary accent reads from a CSS variable (see src/index.css) so you can
        // switch neon orange to high-viz yellow in one line.
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        ring: {
          '0%': { boxShadow: '0 0 0 0 rgb(var(--accent) / 0.55)' },
          '70%': { boxShadow: '0 0 0 18px rgb(var(--accent) / 0)' },
          '100%': { boxShadow: '0 0 0 0 rgb(var(--accent) / 0)' },
        },
        streak: {
          '0%': { transform: 'translateX(-120%)', opacity: '0' },
          '30%': { opacity: '1' },
          '100%': { transform: 'translateX(220%)', opacity: '0' },
        },
      },
      animation: {
        ring: 'ring 2s ease-out infinite',
        streak: 'streak 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
