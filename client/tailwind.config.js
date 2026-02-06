module.exports = {
    darkMode: "class", // 👈 non-negotiable
    content: [
        "./public/index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
