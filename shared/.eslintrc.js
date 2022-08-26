module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true,
    },
    extends: ['eslint:recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        NodeJS: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prefer-arrow-functions'],
    rules: {
        'no-unused-vars': 0,
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
        'prefer-const': 'error',
        'guard-for-in': 'error',
        "prefer-arrow-functions/prefer-arrow-functions": ["error", {
            "singleReturnOnly": false,
            "classPropertiesAllowed": false,
            "disallowPrototype": false,
            "returnStyle": "unchanged",
        }]
    },
};
