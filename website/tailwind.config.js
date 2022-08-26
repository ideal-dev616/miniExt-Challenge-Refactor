module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        '../shared/**/*.tsx'
    ],
    plugins: [require('@tailwindcss/forms')],
};
