/* global process */

import {
    AnimatedBarChart as AnimatedBarChartProd,
    AnimatedColumnChart as AnimatedColumnChartProd
} from "../dist/esm/animated-bars.min.js";

import {
    AnimatedBarChart as AnimatedBarChartDev,
    AnimatedColumnChart as AnimatedColumnChartDev
} from "../dist/esm/animated-bars.js";

export const AnimatedBarChart = process.env.NODE_ENV === "production"
    ? AnimatedBarChartProd
    : AnimatedBarChartDev;
export const AnimatedColumnChart = process.env.NODE_ENV === "production"
    ? AnimatedColumnChartProd
    : AnimatedColumnChartDev;
