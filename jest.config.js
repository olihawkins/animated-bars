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
    // Define __DEV__ when testing source code
    // (`babel-plugin-dev-expression` does not operate when NODE_ENV=test)
    globals: testEnv === "src" ? {__DEV__: !isProd} : undefined,
    // Skip unit tests when testing builds.
    // Also skip in production mode because error messages are stripped in production.
    testPathIgnorePatterns: [
        "/node_modules/",
        ...(
            testEnv !== "src" || isProd
                ? ["/test/animated-rectangle-chart.test.js", "/test/utils.test.js"]
                : []
        )
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
