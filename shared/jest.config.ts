/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '\\.(skip)\\.'],
    collectCoverageFrom: ['**/*.ts'],
    coverageDirectory: 'coverage',
    preset: 'ts-jest',
};
