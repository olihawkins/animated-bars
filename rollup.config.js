import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

const configs = [];
for (const format of ["cjs", "esm", "umd"]) {
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
