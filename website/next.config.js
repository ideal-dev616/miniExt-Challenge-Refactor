const moduleExports = {
    reactStrictMode: true,
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'upload.wikimedia.org',
            'airtable.com',
            'static.airtable.com',
        ],
    },
    experimental: {
        externalDir: true,
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };

        config.module.rules.push({
            test: /\.bin$/i,
            type: 'asset/resource',
            generator: {
                // important, otherwise it will output into a folder that is not served by next
                filename: 'static/[hash][ext][query]',
            },
        });

        config.output.webassemblyModuleFilename =
            'static/wasm/[modulehash].wasm';

        // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
        config.experiments = { asyncWebAssembly: true };

        return config;
    },
};

module.exports = moduleExports;
