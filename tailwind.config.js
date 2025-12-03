/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dune: {
          sand: '#D4A574',      // 沙漠金
          spice: '#FF6B35',     // 香料橘
          deep: '#1A1A2E',      // 深藍
          sky: '#16213E',       // 天空藍
          dark: '#0F0E17',      // 深黑
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
