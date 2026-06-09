/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        practo: {
          blue: '#14437a',
          lightBlue: '#f0f5fa',
          accent: '#28328c',
          text: '#414146',
          muted: '#787887'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
