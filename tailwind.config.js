/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
        },
        background: {
          DEFAULT: '#F3F4F6',
          dark: '#E5E7EB',
        }
      }
    },
  },
  plugins: [],
}