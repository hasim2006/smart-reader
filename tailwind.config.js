/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563EB', // Primary
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        navy: {
          800: '#1e293b',
          900: '#0F172A', // Secondary
          950: '#020617',
        },
        accent: {
          400: '#2dd4bf',
          500: '#14B8A6', // Accent Teal
          600: '#0d9488',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#0B0F19',
          cardLight: '#FFFFFF',
          cardDark: '#151D2A',
          borderLight: '#E2E8F0',
          borderDark: '#1E293B',
        }
      },
      borderRadius: {
        'enterprise': '14px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'enterprise-sm': '0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.06)',
        'enterprise-md': '0 4px 14px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)',
        'enterprise-lg': '0 10px 25px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05)',
        'glow-primary': '0 0 20px rgba(37, 99, 235, 0.25)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.25)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'shimmer': 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
};
