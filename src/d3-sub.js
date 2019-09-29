/* D3: A subset of D3 functions -------------------------------------------- */

/* Imports ----------------------------------------------------------------- */

import {
    axisTop,
    axisRight,
    axisBottom,
    axisLeft
} from "d3-axis";

import {
    easeCubic,
    easeCubicIn,
    easeCubicOut
} from "d3-ease";

import {
    format
} from "d3-format";

import {
    scaleBand,
    scaleLinear
} from "d3-scale";

import {
    select,
    selectAll
} from "d3-selection";

import {
    transition
} from "d3-transition";

/* Constants --------------------------------------------------------------- */

const d3 = {
    format,
    select,
    selectAll,
    scaleBand,
    scaleLinear,
    axisTop,
    axisRight,
    axisBottom,
    axisLeft,
    easeCubic,
    easeCubicIn,
    easeCubicOut,
    transition
};

/* Exports ----------------------------------------------------------------- */

export {
    d3
};
