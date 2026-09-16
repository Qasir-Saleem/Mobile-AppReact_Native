/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
     extend: {
    colors: {
      yellow: '#D5AF34',
      lightYellow: '#F7EFD6',
      black: '#000000',
      lightGray: '#A7A7AA',
      gray: '#515151',
      darkGray: '#8E8E8E',
      bgGray: '#C4C4C4',
      disable: '#DCDCDC',
      green: '#00BA00',
      red: '#BC0000',
      redError: '#FF0000',
    },

    fontSize: {
      '6xl': '60px',
      '5xl': '36px',
      '4xl': '32px',
      '3xl': '30px',
      '2xl': '24px',
      xl: '20px',
      lg: '16px',
      md: '14px',
      sm: '12px',
      xs: '10px',
    },

    lineHeight: {
      '6xl': '48px',
      '5xl': '44px',
      '4xl': '40px',
      '3xl': '36px',
      '2xl': '32px',
      xl: '28px',
      lg: '24px',
      md: '20px',
      sm: '16px',
      xs: '14px',
    },

    backgroundImage: {
      navbarLiner:
        'linear-gradient(180deg, #000000 57.54%, rgba(0, 0, 0, 0) 100%)',
      bookingNavbar:
        'linear-gradient(266.47deg, #000000 58.6%, #666666 131.89%)',
      foogyEffect:
        'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
      topFoogyEffect:
        'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 60%)',
      bannerBlackGray: 'linear-gradient(90deg, #000000 50%, #515151 100%)',
      bottomSheetEffect:
        'linear-gradient(180deg, #FFFFFF 79.81%, #F7EFD6 100%)',
    },
    maxWidth: {
      '7xl': '1170px',
    },
    boxShadow: {
      bookingShadow: '0px 6px 12px 0px #00000040',
      homeShadow: '0px 30px 60px 0px #0013570F',
    },
    fontFamily: {
      baskervville: ['Baskervville', 'serif'],
    },
  },
  },
  plugins: [],
}

