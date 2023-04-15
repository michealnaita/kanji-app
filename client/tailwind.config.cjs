/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundColor: {
        skin: {
          primary: '#1E2022',
          secondary: '#292B2D',
          lime: '#9EFC27',
          red: '#EB434D',
        },
      },
      textColor: {
        skin: {
          cyan: '#6EBFB8',
          orange: '#F6955C',
          'off-white': '#D2D2D3',
          primary: '#D2D2D3',
          secondary: '#929292',
          gary: '#929292',
          gray: '#929292',
          lime: '#9EFC27',
          red: '#EB434D',
          dark: '#1E2022',
        },
      },
      borderColor: {
        skin: {
          primary: '#F6955C',
          secondary: '#828282',
          lime: '#9EFC27',
        },
      },
      ringColor: {
        skin: {
          primary: '#9EFC27',
        },
      },
      fontFamily: {
        'patrick-hand':
          "'Patrick Hand SC', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
      },
    },
  },
};
