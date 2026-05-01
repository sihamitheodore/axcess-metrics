/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ax: {
          red: "#970000",
          hot: "#E11D48",
          black: "#0A0A0A",
          ink: "#161616",
          paper: "#F7F5F2",
          line: "#E7E2DC"
        }
      },
      boxShadow: {
        premium: "0 24px 70px rgba(22,22,22,0.08)",
        glow: "0 0 30px rgba(225,29,72,0.35)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        drift: {
          "0%": { backgroundPosition: "0% 42%, 100% 50%, 0 0" },
          "100%": { backgroundPosition: "18% 50%, 76% 38%, 0 0" }
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        }
      },
      animation: {
        fadeUp: "fadeUp 800ms cubic-bezier(0.16,1,0.3,1) both",
        drift: "drift 18s ease-in-out infinite alternate",
        floatSlow: "floatSlow 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
