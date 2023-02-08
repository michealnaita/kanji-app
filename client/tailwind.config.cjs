/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        skin: { primary: '#17191B' },
      },
      textColor: {
        skin: {
          cyan: '#6EBFB8',
          orange: '#F6955C',
          'off-white': '#D2D2D3',
          gary: '#828282',
        },
      },
      borderColor: {
        skin: {
          primary: '#F6955C',
        },
      },
    },
  },
  plugins: [],
};
