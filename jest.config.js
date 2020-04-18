/* eslint-env node */

module.exports = {
    testRegex: "test/.*\\.(js|jsx)$",
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.js"],
    // Resolve `import from 'animated-bars'` to src
    moduleNameMapper: {
        "^animated-bars$": "<rootDir>/src/index.js"
    }
};
