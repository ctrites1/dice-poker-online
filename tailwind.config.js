/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				display: ["Vollkorn", "serif"],
			},
			fontWeight: {
				normal: "400",
				medium: "500",
				semibold: "600",
				bold: "700",
			},
		},
	},
	plugins: [],
};
