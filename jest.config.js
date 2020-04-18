/* eslint-env node */

const testEnv = (process.env.TEST_ENV || "src").toLowerCase(),
    isProd = process.env.NODE_ENV === "production";

module.exports = {
    testRegex: "test/.*\\.(js|jsx)$",
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.js"],
    // Resolve `import from 'animated-bars'` to src or build, depending on env variable
    moduleNameMapper: {
        "^animated-bars$": resolvePath()
    },
    // Skip unit tests when testing builds
    testPathIgnorePatterns: [
        "/node_modules/",
        ...(testEnv !== "src" ? ["/test/animated-rectangle-chart.test.js", "/test/utils.test.js"] : [])
    ]
};

function resolvePath() {
    if (testEnv === "src") return "<rootDir>/src/index.js";
    if (testEnv === "cjs") return "<rootDir>/index.js";
    if (testEnv === "esm") return "<rootDir>/es/index.js";
    if (testEnv === "umd") return `<rootDir>/dist/umd/animated-bars${isProd ? ".min" : ""}.js`;

    throw new Error(
        `Invalid TEST_ENV '${testEnv}' - valid options are 'cjs', 'esm', 'umd', 'src' or undefined`
    );
}
