/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        skin: { primary: '#17191B', secondary: '#1E2022' },
      },
      textColor: {
        skin: {
          cyan: '#6EBFB8',
          orange: '#F6955C',
          'off-white': '#D2D2D3',
          primary: '#D2D2D3',
          secondary: '#828282',
          gary: '#828282',
          lime: '#75B975',
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
