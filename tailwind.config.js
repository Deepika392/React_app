/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'thumbnail': '200px',  // Custom size
      },
      height: {
        'thumbnail': '200px',  // Custom size
      }
    }
  },
  plugins: [],
}


