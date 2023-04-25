/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
		colors: {
			pinkgradient: '',
			lilac: '#E0AAFF',
			white: '#fff',
			darkblue: '#040321',
			transparent: 'rgba(0, 0, 0, 0.7)',
			red: '#FC3E3E',
			gray: '#6b7280',
		}
	},
	plugins: [],
}

