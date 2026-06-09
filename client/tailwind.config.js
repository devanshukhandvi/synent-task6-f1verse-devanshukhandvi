/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#050508",
          card: "rgba(13, 13, 23, 0.65)",
          border: "rgba(255, 255, 255, 0.08)",
          red: "#FF1801",
          gold: "#D4AF37",
          green: "#00E5A3",
          blue: "#00A5FF"
        }
      },
      fontFamily: {
        f1: ["Orbitron", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      animation: {
        'glitch-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
