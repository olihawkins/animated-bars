/* global process, module */

if (process.env.NODE_ENV === "production") {
    module.exports = require("./dist/cjs/animated-bars.min.js");
} else {
    module.exports = require("./dist/cjs/animated-bars.js");
}
