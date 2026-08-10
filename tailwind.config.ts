import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#0F766E',
          600: '#0D6E6B',
          700: '#0A5A58',
          800: '#084846',
          900: '#063837',
        },
        urgent: '#F59E0B',
        critical: '#E11D48',
        resolved: '#10B981',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15, 118, 110, 0.06)',
        card: '0 4px 16px rgba(15, 118, 110, 0.08)',
        lift: '0 8px 32px rgba(15, 118, 110, 0.12)',
      },
      backgroundImage: {
        'mesh-brand':
          'radial-gradient(at 40% 20%, hsla(176, 62%, 85%, 0.4) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(172, 70%, 80%, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(176, 50%, 90%, 0.3) 0px, transparent 50%)',
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config
