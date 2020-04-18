/* global process */

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

// Get build formats
// Use `BUILD_ENV` to build only specific formats.
// e.g. `BUILD_ENV=cjs npm run build` or `BUILD_ENV=cjs,esm npm run build`
// Plain `npm run build` builds them all.
const formats = getFormats(["cjs", "esm", "umd"]);

// Create build configs
const configs = [];
for (const format of formats) {
    configs.push(
        createConfig(format, false),
        createConfig(format, true)
    );
}

export default configs;

function createConfig(format, isProduction) {
    return {
        input: "src/index.js",
        output: {
            file: `dist/${format}/animated-bars${isProduction ? ".min" : ""}.js`,
            format,
            name: "animatedBars",
            sourcemap: true
        },
        plugins: [
            babel({
                exclude: "node_modules/**"
            }),
            resolve(),
            commonjs(),
            replace({
                // Set NODE_ENV to strip out __DEV__ code-fenced code in production builds
                "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development")
            }),
            isProduction ? terser() : undefined
        ],
        onwarn: disableCircularDependencyWarnings
    };
}

// Disable circular dependency warnings from D3
// https://github.com/d3/d3-selection/issues/168
function disableCircularDependencyWarnings(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
}

function getFormats(allFormats) {
    const formatsStr = process.env.BUILD_ENV;

    // Default = all formats
    if (!formatsStr) return allFormats;

    // Parse list of formats
    // eslint-disable-next-line no-shadow
    const formats = formatsStr.split(",").map(format => format.toLowerCase());
    const invalidFormat = formats.find(format => format !== "all" && !allFormats.includes(format));
    if (invalidFormat != null) {
        throw new Error(`Unrecognised BUILD_ENV format '${invalidFormat}' - supported formats are ${allFormats.map(format => `'${format}'`).join(", ")} or 'all'`);
    }

    if (formats.includes("all")) return allFormats;

    return formats;
}
