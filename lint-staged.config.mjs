const config = {
    'marketplace/frontend/**/*.{ts,tsx,tsx}': (filenames) =>
        `yarn prettier --write ${filenames
            .map((item) => `"${item}"`)
            .join(' ')}`,

    'website/!(.next)/**/*.{ts,tsx,js}': (filenames) =>
        `yarn prettier --write ${filenames.join(' ')}`,
    'shared/**/*.{ts,tsx}': (filenames) =>
        `yarn prettier --write ${filenames.join(' ')}`,
};

export default config;
