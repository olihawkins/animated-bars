import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";

// Disable circular dependency warnings from D3
// https://github.com/d3/d3-selection/issues/168
const disableCircularDependencyWarnings = function (warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
};

export default [
    { // ES6 Module
        input: "src/index.js",
        output: {
            file: "dist/animated-bars.js",
            format: "esm",
            sourcemap: true,
            sourcemapFile: "dist/animated-bars.js.map"
        },
        plugins: [
            babel({
                exclude: "node_modules/**"
            }),
            resolve(),
            commonjs(),
            serve()
        ],
        onwarn: disableCircularDependencyWarnings
    },
    { // Browser
        input: "src/index.js",
        output: {
            file: "dist/animated-bars.min.js",
            format: "iife",
            name: "animatedBars",
            sourcemap: true,
            sourcemapFile: "dist/animated-bars.min.js.map"
        },
        plugins: [
            babel({
                exclude: "node_modules/**"
            }),
            resolve(),
            commonjs(),
            terser()
        ],
        onwarn: disableCircularDependencyWarnings
    }
];
