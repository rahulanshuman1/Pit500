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
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        chase: {
          '0%, 100%': { opacity: '0.12' },
          '40%': { opacity: '1' },
        },
        kenburns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.09)' },
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
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 1.2s ease-out both',
        kenburns: 'kenburns 18s ease-in-out infinite alternate',
        marquee: 'marquee 30s linear infinite',
        float: 'float 6s ease-in-out infinite',
        chase: 'chase 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
