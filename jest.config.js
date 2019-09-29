/* eslint-env node */

module.exports = {
    testRegex: "test/.*\\.(js|jsx)$",
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    }
};
