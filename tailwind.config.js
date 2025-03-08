export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#1E1B4B',
        accent: '#00D4FF',
      },
      keyframes: {
        'gradient-pulse': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      animation: {
        'gradient-pulse': 'gradient-pulse 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}