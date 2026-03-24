/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        secondary: '#22C55E',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}