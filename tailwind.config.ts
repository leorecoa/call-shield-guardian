import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: '#4FACFE',
        neonPurple: '#B721FF',
        neonPink: '#FF0080',
        neonGreen: '#00F260',
        neonYellow: '#FFDD00',
        darkNeon: {
          900: '#0A0B14',
          800: '#12141F',
          700: '#1A1C2A',
          600: '#222435',
        },
      },
      animation: {
        'pulse-shield': 'pulse-shield 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-shield': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-glow': 'linear-gradient(to right, var(--neon-blue), var(--neon-purple))',
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(79, 172, 254, 0.5), 0 0 20px rgba(79, 172, 254, 0.3)',
        'neon-purple': '0 0 10px rgba(183, 33, 255, 0.5), 0 0 20px rgba(183, 33, 255, 0.3)',
        'neon-pink': '0 0 10px rgba(255, 0, 128, 0.5), 0 0 20px rgba(255, 0, 128, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;