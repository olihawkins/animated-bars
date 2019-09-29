/* Tests: AnimatedBarChart ---------------------------------------------- */

/* Imports ----------------------------------------------------------------- */

import { AnimatedBarChart } from "../src/animated-bar-chart.js";
import { getConstants } from "../src/constants.js";

/* Constants --------------------------------------------------------------- */

const constants = getConstants();
const setupData = [1, 2, 3].map(i => ({key: i, value: i}));

/* Functions --------------------------------------------------------------- */

function getConfig() {
    return {
        dimensions: {
            width: 120,
            height: 120,
        },
        margins: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        valueMin: -100,
        valueMax: 100
    };
}

/* Tests: getKeyLocationTransform ----------------------------------------- */

test("getKeyLocationTransform gets transfrom for keyLocationMin", () => {
    const config = getConfig();
    config.keyLocation = constants.keyLocationMin;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getKeyLocationTransform()).toBe(0);
});

test("getKeyLocationTransform gets transfrom for keyLocationZero", () => {
    const config = getConfig();
    config.keyLocation = constants.keyLocationZero;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getKeyLocationTransform()).toBe(50);
});

test("getKeyLocationTransform gets transfrom for keyLocationMax", () => {
    const config = getConfig();
    config.keyLocation = constants.keyLocationMax;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getKeyLocationTransform()).toBe(100);
});

/* Tests: getKeyTitleTransform -------------------------------------------- */

test("getKeyTitleTransform gets transfrom for keyLocationMin", () => {
    const config = getConfig();
    config.keyLocation = constants.keyLocationMin;
    config.keyTitleOffset = 10;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getKeyTitleTransform()).toBe(-10);
});

test("getKeyTitleTransform gets transfrom for keyLocationZero", () => {
    const config = getConfig();
    config.keyLocation = constants.keyLocationZero;
    config.keyTitleOffset = 10;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getKeyTitleTransform()).toBe(-10);
});

test("getKeyTitleTransform gets transfrom for keyLocationMax", () => {
    const config = getConfig();
    config.keyLocation = constants.keyLocationMax;
    config.keyTitleOffset = 10;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getKeyTitleTransform()).toBe(110);
});

/* Tests: getValueLocationTransform ----------------------------------------- */

test("getValueLocationTransform gets transfrom for valueLocationStart", () => {
    const config = getConfig();
    config.valueLocation = constants.valueLocationStart;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getValueLocationTransform()).toBe(0);
});

test("getValueLocationTransform gets transfrom for valueLocationEnd", () => {
    const config = getConfig();
    config.valueLocation = constants.valueLocationEnd;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getValueLocationTransform()).toBe(100);
});

/* Tests: getKeyTitleTransform -------------------------------------------- */

test("getValueTitleTransform gets transfrom for valueLocationStart", () => {
    const config = getConfig();
    config.valueLocation = constants.valueLocationStart;
    config.valueTitleOffset = 10;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getValueTitleTransform()).toBe(-10);
});

test("getValueTitleTransform gets transfrom for valueLocationEnd", () => {
    const config = getConfig();
    config.valueLocation = constants.valueLocationEnd;
    config.valueTitleOffset = 10;
    const chart = new AnimatedBarChart(setupData, config);
    expect(chart.getValueTitleTransform()).toBe(110);
});
