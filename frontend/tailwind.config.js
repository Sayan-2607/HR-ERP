/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ws: {
          primary: "#6C5CE7",
          "primary-light": "#A29BFE",
          secondary: "#00CEC9",
          accent: "#FD79A8",
          success: "#00B894",
          warning: "#FDCB6E",
          danger: "#FF7675",
          dark: "#0A0A1A",
          "dark-card": "rgba(20, 20, 45, 0.7)",
          glass: "rgba(255,255,255,0.04)",
          "glass-border": "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-mesh": "radial-gradient(at 20% 80%, #6C5CE720 0, transparent 50%), radial-gradient(at 80% 20%, #00CEC920 0, transparent 50%), radial-gradient(at 50% 50%, #FD79A810 0, transparent 50%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideRight: { "0%": { opacity: "0", transform: "translateX(-20px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};
