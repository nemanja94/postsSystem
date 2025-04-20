/** @type {import('tailwindcss').Config} */

const config = {
    plugins: {
        '@tailwindcss/postcss': {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                },
            },
        },
    },
};

export default config;
