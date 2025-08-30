/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
        extend: {
          colors: {
            'navy-blue': '#000080',
            azure: '#0d272e',
            baby: '#fdf2f8',
            grape: '#392A48',
            ticket: '#2d1640',
            nav: '#d5d998',
            one: '#220049',
            two: '#6806CB',
            three: '#54FFF5',
            card: '#f9fad9',
            fuck: '#df40f7',
            me:'#efb7f7'

            
            // Example hex code for navy blue
      },
      fontFamily: {
        body: ["Poppins"],
        head:["Poppins"]
      },
      
        },
      },
  plugins: [],
}
