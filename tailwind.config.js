/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [],
	theme: {
		extend: {
			container: {
				center: true,
			},
			fontFamily: {
				sans: ['Public Sans', 'sans-serif'],
			},
			fontWeight: {
				w300: 300,
				w400: 400,
				w700: 700,
			},
			colors: {
				primary: {
					1: 'hsl(233, 26%, 24%)',
					2: 'hsl(136, 65%, 51%)',
					3: 'hsl(192, 70%, 51%)',
				},
				neutral: {
					1: 'hsl(233, 8%, 62%)',
					2: 'hsl(220, 16%, 96%)',
					3: 'hsl(0, 0%, 98%)',
					4: 'hsl(0, 0%, 100%)',
				},
			},
		},
	},
	plugins: [],
}
