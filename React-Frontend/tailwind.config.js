
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container:{
      padding:{
        DEFAULT:"1rem",
        sm:'2rem',
        md:'2rem',
        lg:"2.5rem",
        xl:'3rem',
        "2xl":'4rem'
      },
      screens:{
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px"
      }
    },
    //هان لما بدنا نعمل cusome color ,custome font
   
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
    container: {
      center: true,
      padding: "50px"  //left
    },    
    extend: {
    //هان لما ابدنا نضيف كلاسات على المكتبة
    colors:{
      "green" :"#4B5929",
      "green-hover":"#A8C686",
      "brown":"#8B6F47",
      "orange":"#D9A066",
      "red":"#B22222",
      "nile":"#2E3A59",
      "bage":"#F5E9DA",
      "white":"#FAF7F2",
      "black":"#222222",
      
    }
    },
    keyframes:{
      move:{
        '50%':{transform:'translateY(-1rem)'}
      },
      rotate:{
        "0%":{transform:"rotate(0deg)"},
        "100%":{transform:"rotate(360deg)"},

      },
      slideDown: {
        '0%': { opacity: '0', transform: 'translateY(-10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation:{
      movingy:'move 3s linear infinite',
      rotating:"rotate 15s linear infinite",
      slideDown: 'slideDown 0.3s ease-out',

    }
      
  },

  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

