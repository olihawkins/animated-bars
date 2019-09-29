/* Tests: AnimatedRectangleChart ------------------------------------------- */

/* Imports ----------------------------------------------------------------- */

import { AnimatedRectangleChart } from "../src/animated-rectangle-chart.js";

/* Constants --------------------------------------------------------------- */

const setupData = [1, 2, 3].map(i => ({key: i, value: i}));
const chart = new AnimatedRectangleChart(setupData, {});
const defaults = chart.getDefaults();

/* Tests: getMaxDelay ----------------------------------------------------- */

test("getMaxDelay throws error for non-numeric values", () => {
    const data = [1, 2, 3, 4, "five"].map(i => ({delay: i}));
    const error = "Delay values must be positive numbers";
    expect(() => chart.getMaxDelay(data)).toThrow(error);
});

test("getMaxDelay throws error for negative numeric values", () => {
    const data = [1, 2, 3, 4, -5].map(i => ({delay: i}));
    const error = "Delay values must be positive numbers";
    expect(() => chart.getMaxDelay(data)).toThrow(error);
});

test("getMaxDelay gets the maximum delay", () => {
    const data = [1, 2, 3, 4, 5].map(i => ({delay: i}));
    expect(chart.getMaxDelay(data)).toBe(5);
});

/* Tests: getUpdateData --------------------------------------------------- */

test("getUpdate throws error when new data is shorter", () => {
    const shorterData = [1, 2].map(i => ({key: i, value: i}));
    const error = "New data does not have the expected length";
    expect(() => chart.getUpdateData(shorterData)).toThrow(error);
});

test("getUpdate throws error when newer data is shorter", () => {
    const longerData = [1, 2, 3, 4].map(i => ({key: i, value: i}));
    const error = "New data does not have the expected length";
    expect(() => chart.getUpdateData(longerData)).toThrow(error);
});

test("getUpdate throws error when a key is missing from setupData", () => {
    const setupData = [1, 2, 3].map(i => ({value: i}));
    const nextData = [1, 2, 3].map(i => ({key: i, value: i}));
    const chart = new AnimatedRectangleChart(setupData, {});
    const error = "All data objects must have a key property";
    expect(() => chart.getUpdateData(nextData)).toThrow(error);
});

test("getUpdate throws error when a key is missing from nextData", () => {
    const nextData = [1, 2, 3].map(i => ({value: i}));
    const error = "All data objects must have a key property";
    expect(() => chart.getUpdateData(nextData)).toThrow(error);
});

test("getUpdate throws error when a value is missing from setupData", () => {
    const setupData = [1, 2, 3].map(i => ({key: i}));
    const nextData = [1, 2, 3].map(i => ({key: i, value: i}));
    const chart = new AnimatedRectangleChart(setupData, {});
    const error = "All data objects must have a value property";
    expect(() => chart.getUpdateData(nextData)).toThrow(error);
});

test("getUpdate throws error when a value is missing from nextData", () => {
    const nextData = [1, 2, 3].map(i => ({key: i}));
    const error = "All data objects must have a value property";
    expect(() => chart.getUpdateData(nextData)).toThrow(error);
});

test("getUpdate throws error when keys in data do not match", () => {
    const nextData = [2, 3, 4].map(i => ({key: i, value: i}));
    const error = "New data does not contain the expected keys";
    expect(() => chart.getUpdateData(nextData)).toThrow(error);
});

test("getUpdate returns update data with the correct length", () => {
    const nextData = [1, 2, 3].map(i => ({key: i, value: i * 2}));
    const updateData = chart.getUpdateData(nextData);
    expect(updateData.length).toBe(3);
});

test("getUpdate returns update data with the correct values", () => {
    const nextData = [1, 2, 3].map(i => ({key: i, value: i * 2}));
    const updateData = chart.getUpdateData(nextData);
    expect(updateData).toContainEqual({
        key: 2,
        lastValue: null,
        nextValue: 4,
        posRgb: chart.defaults.colors.posRgb,
        negRgb: chart.defaults.colors.negRgb,
        delay: 0.0
    });
});

test("getUpdate sets custom colors from config", () => {
    const nextData = [1, 2, 3].map(i => ({key: i, value: i * 2}));
    const chart = new AnimatedRectangleChart(setupData, {
        colors: {
            posRgb: "#0000ff",
            negRgb: "#ff0000"
        }
    });
    const updateData = chart.getUpdateData(nextData);
    expect(updateData).toContainEqual({
        key: 1,
        lastValue: null,
        nextValue: 2,
        posRgb: "#0000ff",
        negRgb: "#ff0000",
        delay: 0.0
    });
});

/* Tests: parseConfig validation ------------------------------------------ */

test("parseConfig throws error for null dimensions.width", () => {
    const error = "dimensions.width should be a number";
    const config = { dimensions: {width: null} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string dimensions.width", () => {
    const error = "dimensions.width should be a number";
    const config = { dimensions: {width: "string"} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative dimensions.width", () => {
    const error = "dimensions.width should be a positive number";
    const config = { dimensions: {width: -1} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for dimensions.width", () => {
    const error = "dimensions.width should be a positive number";
    const config = { dimensions: {width: 0} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for dimensions.width", () => {
    const error = "dimensions.height should be a positive number";
    const config = { dimensions: {width: 1} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null dimensions.height", () => {
    const error = "dimensions.height should be a number";
    const config = { dimensions: {height: null} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string dimensions.height", () => {
    const error = "dimensions.height should be a number";
    const config = { dimensions: {height: "string"} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative dimensions.height", () => {
    const error = "dimensions.height should be a positive number";
    const config = { dimensions: {height: -1} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for dimensions.height", () => {
    const error = "dimensions.height should be a positive number";
    const config = { dimensions: {height: 0} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for dimensions.height", () => {
    const error = "dimensions.height should be a positive number";
    const config = { dimensions: {height: 1} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null margins.top", () => {
    const error = "margins.top should be a number";
    const config = { margins: {top: null} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string margins.top", () => {
    const error = "margins.top should be a number";
    const config = { margins: {top: "string"} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative margins.top", () => {
    const error = "margins.top should be a positive number";
    const config = { margins: {top: -1} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for margins.top", () => {
    const error = "margins.top should be a positive number";
    const config = { margins: {top: 0} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for margins.top", () => {
    const error = "margins.top should be a positive number";
    const config = { margins: {top: 1} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null margins.right", () => {
    const error = "margins.right should be a number";
    const config = { margins: {right: null} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string margins.right", () => {
    const error = "margins.right should be a number";
    const config = { margins: {right: "string"} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative margins.right", () => {
    const error = "margins.right should be a positive number";
    const config = { margins: {right: -1} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for margins.right", () => {
    const error = "margins.right should be a positive number";
    const config = { margins: {right: 0} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for margins.right", () => {
    const error = "margins.right should be a positive number";
    const config = { margins: {right: 1} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null margins.bottom", () => {
    const error = "margins.bottom should be a number";
    const config = { margins: {bottom: null} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string margins.bottom", () => {
    const error = "margins.bottom should be a number";
    const config = { margins: {bottom: "string"} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative margins.bottom", () => {
    const error = "margins.bottom should be a positive number";
    const config = { margins: {bottom: -1} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for margins.bottom", () => {
    const error = "margins.bottom should be a positive number";
    const config = { margins: {bottom: 0} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for margins.bottom", () => {
    const error = "margins.bottom should be a positive number";
    const config = { margins: {bottom: 1} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null margins.left", () => {
    const error = "margins.left should be a number";
    const config = { margins: {left: null} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string margins.left", () => {
    const error = "margins.left should be a number";
    const config = { margins: {left: "string"} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative margins.left", () => {
    const error = "margins.left should be a positive number";
    const config = { margins: {left: -1} };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for margins.left", () => {
    const error = "margins.left should be a positive number";
    const config = { margins: {left: 0} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for margins.left", () => {
    const error = "margins.left should be a positive number";
    const config = { margins: {left: 1} };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for a null keyLocation", () => {
    const nullValue = null;
    const error = `"${nullValue}" is not a valid keyLocation`;
    const config = { keyLocation: nullValue };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for a boolean keyLocation", () => {
    const boolean = true;
    const error = `"${boolean}" is not a valid keyLocation`;
    const config = { keyLocation: boolean };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for an invalid keyLocation", () => {
    const invalidString = "string";
    const error = `"${invalidString}" is not a valid keyLocation`;
    const config = { keyLocation: invalidString };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for null keyTitleOffset", () => {
    const error = "keyTitleOffset should be a number";
    const config = { keyTitleOffset: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string keyTitleOffset", () => {
    const error = "keyTitleOffset should be a number";
    const config = { keyTitleOffset: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative keyTitleOffset", () => {
    const error = "keyTitleOffset should be a positive number";
    const config = { keyTitleOffset: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for keyTitleOffset", () => {
    const error = "keyTitleOffset should be a positive number";
    const config = { keyTitleOffset: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for keyTitleOffset", () => {
    const error = "keyTitleOffset should be a positive number";
    const config = { keyTitleOffset: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null keyTickSizeInner", () => {
    const error = "keyTickSizeInner should be a number";
    const config = { keyTickSizeInner: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string keyTickSizeInner", () => {
    const error = "keyTickSizeInner should be a number";
    const config = { keyTickSizeInner: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative keyTickSizeInner", () => {
    const error = "keyTickSizeInner should be a positive number";
    const config = { keyTickSizeInner: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for keyTickSizeInner", () => {
    const error = "keyTickSizeInner should be a positive number";
    const config = { keyTickSizeInner: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for keyTickSizeInner", () => {
    const error = "keyTickSizeInner should be a positive number";
    const config = { keyTickSizeInner: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null keyTickSizeOuter", () => {
    const error = "keyTickSizeOuter should be a number";
    const config = { keyTickSizeOuter: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string keyTickSizeOuter", () => {
    const error = "keyTickSizeOuter should be a number";
    const config = { keyTickSizeOuter: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative keyTickSizeOuter", () => {
    const error = "keyTickSizeOuter should be a positive number";
    const config = { keyTickSizeOuter: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for keyTickSizeOuter", () => {
    const error = "keyTickSizeOuter should be a positive number";
    const config = { keyTickSizeOuter: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for keyTickSizeOuter", () => {
    const error = "keyTickSizeOuter should be a positive number";
    const config = { keyTickSizeOuter: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for a null valueLocation", () => {
    const nullValue = null;
    const error = `"${nullValue}" is not a valid valueLocation`;
    const config = { valueLocation: nullValue };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for a boolean valueLocation", () => {
    const boolean = true;
    const error = `"${boolean}" is not a valid valueLocation`;
    const config = { valueLocation: boolean };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for an invalid valueLocation", () => {
    const invalidString = "string";
    const error = `"${invalidString}" is not a valid valueLocation`;
    const config = { valueLocation: invalidString };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for null valueTitleOffset", () => {
    const error = "valueTitleOffset should be a number";
    const config = { valueTitleOffset: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string valueTitleOffset", () => {
    const error = "valueTitleOffset should be a number";
    const config = { valueTitleOffset: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative valueTitleOffset", () => {
    const error = "valueTitleOffset should be a positive number";
    const config = { valueTitleOffset: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for valueTitleOffset", () => {
    const error = "valueTitleOffset should be a positive number";
    const config = { valueMin: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for valueTitleOffset", () => {
    const error = "valueTitleOffset should be a positive number";
    const config = { valueTitleOffset: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null valueMin", () => {
    const error = "valueMin should be a number";
    const config = { valueMin: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string valueMin", () => {
    const error = "valueMin should be a number";
    const config = { valueMin: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for positive valueMin", () => {
    const error = "valueMin should be a negative number or zero";
    const config = { valueMin: 1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for valueMin", () => {
    const error = "valueMin should be a negative number or zero";
    const config = { valueMin: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a negative number for valueMin", () => {
    const error = "valueMin should be a negative number or zero";
    const config = { valueMin: -1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null valueMax", () => {
    const error = "valueMax should be a number";
    const config = { valueMax: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string valueMax", () => {
    const error = "valueMax should be a number";
    const config = { valueMax: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative valueMax", () => {
    const error = "valueMax should be a positive number";
    const config = { valueMax: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for valueMax", () => {
    const error = "valueMax should be a positive number";
    const config = { valueMax: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for valueMax", () => {
    const error = "valueMax should be a positive number";
    const config = { valueMax: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null valueTicks", () => {
    const error = "valueTicks should be a number";
    const config = { valueTicks: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string valueTicks", () => {
    const error = "valueTicks should be a number";
    const config = { valueTicks: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative valueTicks", () => {
    const error = "valueTicks should be a positive number";
    const config = { valueTicks: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for valueTicks", () => {
    const error = "valueTicks should be a positive number";
    const config = { valueTicks: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for valueTicks", () => {
    const error = "valueTicks should be a positive number";
    const config = { valueTicks: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null valueTickSizeInner", () => {
    const error = "valueTickSizeInner should be a number";
    const config = { valueTickSizeInner: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string valueTickSizeInner", () => {
    const error = "valueTickSizeInner should be a number";
    const config = { valueTickSizeInner: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative valueTickSizeInner", () => {
    const error = "valueTickSizeInner should be a positive number";
    const config = { valueTickSizeInner: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for valueTickSizeInner", () => {
    const error = "valueTickSizeInner should be a positive number";
    const config = { valueTickSizeInner: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for valueTickSizeInner", () => {
    const error = "valueTickSizeInner should be a positive number";
    const config = { valueTickSizeInner: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null valueTickSizeOuter", () => {
    const error = "valueTickSizeOuter should be a number";
    const config = { valueTickSizeOuter: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string valueTickSizeOuter", () => {
    const error = "valueTickSizeOuter should be a number";
    const config = { valueTickSizeOuter: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative valueTickSizeOuter", () => {
    const error = "valueTickSizeOuter should be a positive number";
    const config = { valueTickSizeOuter: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for valueTickSizeOuter", () => {
    const error = "valueTickSizeOuter should be a positive number";
    const config = { valueTickSizeOuter: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for valueTickSizeOuter", () => {
    const error = "valueTickSizeOuter should be a positive number";
    const config = { valueTickSizeOuter: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null valuePaddingInner", () => {
    const error = "valuePaddingInner should be a number";
    const config = { valuePaddingInner: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string valuePaddingInner", () => {
    const error = "valuePaddingInner should be a number";
    const config = { valuePaddingInner: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative valuePaddingInner", () => {
    const error = "valuePaddingInner should be a positive number";
    const config = { valuePaddingInner: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for valuePaddingInner", () => {
    const error = "valuePaddingInner should be a positive number";
    const config = { valuePaddingInner: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for valuePaddingInner", () => {
    const error = "valuePaddingInner should be a positive number";
    const config = { valuePaddingInner: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null valuePaddingOuter", () => {
    const error = "valuePaddingOuter should be a number";
    const config = { valuePaddingOuter: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string valuePaddingOuter", () => {
    const error = "valuePaddingOuter should be a number";
    const config = { valuePaddingOuter: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative valuePaddingOuter", () => {
    const error = "valuePaddingOuter should be a positive number";
    const config = { valuePaddingOuter: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for valuePaddingOuter", () => {
    const error = "valuePaddingOuter should be a positive number";
    const config = { valuePaddingOuter: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for valuePaddingOuter", () => {
    const error = "valuePaddingOuter should be a positive number";
    const config = { valuePaddingOuter: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null transitionTime", () => {
    const error = "transitionTime should be a number";
    const config = { transitionTime: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string transitionTime", () => {
    const error = "transitionTime should be a number";
    const config = { transitionTime: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative transitionTime", () => {
    const error = "transitionTime should be a positive number";
    const config = { transitionTime: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for transitionTime", () => {
    const error = "transitionTime should be a positive number";
    const config = { transitionTime: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for transitionTime", () => {
    const error = "transitionTime should be a positive number";
    const config = { transitionTime: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig throws error for null pauseTime", () => {
    const error = "pauseTime should be a number";
    const config = { pauseTime: null };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for string pauseTime", () => {
    const error = "pauseTime should be a number";
    const config = { pauseTime: "string" };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig throws error for negative pauseTime", () => {
    const error = "pauseTime should be a positive number";
    const config = { pauseTime: -1 };
    expect(() => chart.parseConfig(config, defaults)).toThrow(error);
});

test("parseConfig accepts a zero for pauseTime", () => {
    const error = "pauseTime should be a positive number";
    const config = { pauseTime: 0 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

test("parseConfig accepts a positive number for pauseTime", () => {
    const error = "pauseTime should be a positive number";
    const config = { pauseTime: 1 };
    expect(() => chart.parseConfig(config, defaults)).not.toThrow(error);
});

/* Tests: parseConfig property handling ----------------------------------- */

test("parseConfig fills missing config properties", () => {
    const emptyConfig = {};
    expect(chart.parseConfig(emptyConfig, defaults)).toEqual(defaults);
});

test("parseConfig fills incomplete config properties", () => {
    const incompleteConfig = {
        dimensions: {
            height: defaults.dimensions.height
        },
        margins: {
            top: defaults.margins.top
        },
        colors: {
            posRgb: defaults.colors.posRgb
        }
    };
    expect(chart.parseConfig(incompleteConfig, defaults)).toEqual(defaults);
});

test("parseConfig fills all incomplete config properties", () => {
    const incompleteConfig = {
        dimensions: {
            width: defaults.dimensions.width
        },
        margins: {
            left: defaults.margins.left
        },
        colors: {
            negRgb: defaults.colors.negRgb
        }
    };
    expect(chart.parseConfig(incompleteConfig, defaults)).toEqual(defaults);
});

test("parseConfig does not change defined config properties", () => {
    const definedConfig = {
        element: "user-defined",
        dimensions: {
            width: 1,
            height: 1
        },
        margins: {
            top: 1,
            right: 1,
            bottom: 1,
            left: 1
        },
        keyLocation: "max",
        keyTitle: "user-defined",
        keyTitleOffset: 1,
        valueLocation: "end",
        valueTitle: "user-defined",
        valueTitleOffset: 1,
        valueMin: 0,
        valueMax: 1,
        valueTicks: 1,
        valueFormat: ",.1%",
        valuePaddingInner: 1,
        valuePaddingOuter: 1,
        transitionTime: 1,
        pauseTime: 1
    };
    expect(chart.parseConfig(definedConfig, defaults)).toEqual(definedConfig);
});
