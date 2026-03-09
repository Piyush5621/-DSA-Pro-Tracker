/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                darkBg: '#0f172a',    // slate-900
                darkCard: '#1e293b',  // slate-800
                brandBlue: '#3b82f6', // blue-500
                brandPurple: '#8b5cf6', // purple-500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
