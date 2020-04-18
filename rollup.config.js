import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

export default [
    createConfig("esm"),
    createConfig("iife")
];

function createConfig(format) {
    const isBrowser = format === "iife";

    return {
        input: "src/index.js",
        output: {
            file: `dist/animated-bars${isBrowser ? ".min" : ""}.js`,
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
            isBrowser ? uglify() : undefined
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
