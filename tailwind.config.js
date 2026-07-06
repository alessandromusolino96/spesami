/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAF9",
          border: "#E5EBE8",
        },
        expense: {
          bg: "#FEF2F2",
          text: "#DC2626",
        },
        income: {
          bg: "#ECFDF5",
          text: "#059669",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
        sheet: "1.25rem",
        button: "0.75rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        nav: "0 -4px 20px rgb(0 0 0 / 0.06)",
        fab: "0 8px 24px rgb(5 150 105 / 0.4)",
      },
    },
  },
  plugins: [],
};
