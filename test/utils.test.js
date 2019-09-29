/* Tests: Utilities -------------------------------------------------------- */

/* Imports ----------------------------------------------------------------- */

import {
    hasOwnProperty,
    checkNumber,
    checkNegativeNumber,
    checkPositiveNumber,
    checkKeyLocation,
    checkValueLocation
} from "../src/utils.js";

import { getConstants } from "../src/constants.js";

/* Constants --------------------------------------------------------------- */

const constants = getConstants();
const proto = { proto: "value" };
const obj = Object.create(proto);
obj.own = "value";

/* Tests: hasOwnProperty --------------------------------------------------- */

test("hasOwnProperty finds own properties", () => {
    const prop = "own";
    expect(hasOwnProperty(obj, prop)).toBe(true);
});

test("hasOwnProperty does not find missing properties", () => {
    const prop = "missing";
    expect(hasOwnProperty(obj, prop)).toBe(false);
});

test("hasOwnProperty does not find inherited properties", () => {
    const prop = "proto";
    expect(hasOwnProperty(obj, prop)).toBe(false);
    expect(hasOwnProperty(proto, prop)).toBe(true);
});

/* Tests: checkNumber ------------------------------------------------------ */

test("checkNumber throws error if value is null", () => {
    const error = "property should be a number";
    expect(() => checkNumber("property", null)).toThrow(error);
});

test("checkNumber throws error if value is a string", () => {
    const error = "property should be a number";
    expect(() => checkNumber("property", "string")).toThrow(error);
});

/* Tests: checkNegativeNumber ---------------------------------------------- */

test("checkNegativeNumber throws error if value is null", () => {
    const error = "property should be a number";
    expect(() => checkNegativeNumber("property", null)).toThrow(error);
});

test("checkNegativeNumber throws error if value is a string", () => {
    const error = "property should be a number";
    expect(() => checkNegativeNumber("property", "string")).toThrow(error);
});

test("checkNegativeNumber throws error if value is > 0", () => {
    const error = "property should be a negative number or zero";
    expect(() => checkNegativeNumber("property", 1)).toThrow(error);
});

test("checkNegativeNumber does not throw error if value is 0", () => {
    const error = "property should be a negative number or zero";
    expect(() => checkNegativeNumber("property", 0)).not.toThrow(error);
});

test("checkNegativeNumber does not throw error if value is < 0", () => {
    const error = "property should be a negative number or zero";
    expect(() => checkNegativeNumber("property", -1)).not.toThrow(error);
});

/* Tests: checkPositiveNumber ---------------------------------------------- */

test("checkPositiveNumber throws error if value is null", () => {
    const error = "property should be a number";
    expect(() => checkPositiveNumber("property", null)).toThrow(error);
});

test("checkPositiveNumber throws error if value is a string", () => {
    const error = "property should be a number";
    expect(() => checkPositiveNumber("property", "string")).toThrow(error);
});

test("checkPositiveNumber throws error if value is < 0", () => {
    const error = "property should be a positive number";
    expect(() => checkPositiveNumber("property", -1)).toThrow(error);
});

test("checkPositiveNumber does not throw error if value is 0", () => {
    const error = "property should be a positive number";
    expect(() => checkPositiveNumber("property", 0)).not.toThrow(error);
});

test("checkPositiveNumber does not throw error if value is > 0", () => {
    const error = "property should be a positive number";
    expect(() => checkPositiveNumber("property", 1)).not.toThrow(error);
});

/* Tests: checkKeyLocation ------------------------------------------------- */

test("checkKeyLocation throws error for undefined", () => {
    const undefinedValue = undefined;
    const error = `"${undefinedValue}" is not a valid keyLocation`;
    expect(() => checkKeyLocation(undefinedValue)).toThrow(error);
});

test("checkKeyLocation throws error for null", () => {
    const nullValue = null;
    const error = `"${nullValue}" is not a valid keyLocation`;
    expect(() => checkKeyLocation(nullValue)).toThrow(error);
});

test("checkKeyLocation throws error for a boolean", () => {
    const boolean = true;
    const error = `"${boolean}" is not a valid keyLocation`;
    expect(() => checkKeyLocation(boolean)).toThrow(error);
});

test("checkKeyLocation throws error for an invalid string", () => {
    const invalidString = "Invalid string";
    const error = `"${invalidString}" is not a valid keyLocation`;
    expect(() => checkKeyLocation(invalidString)).toThrow(error);
});

test("checkKeyLocation does not throw error for keyLocationMin", () => {
    const min = constants.keyLocationMin;
    const error = `"${min}" is not a valid keyLocation`;
    expect(() => checkKeyLocation(min)).not.toThrow(error);
});

test("checkKeyLocation does not throw error for keyLocationZero", () => {
    const zero = constants.keyLocationZero;
    const error = `"${zero}" is not a valid keyLocation`;
    expect(() => checkKeyLocation(zero)).not.toThrow(error);
});

test("checkKeyLocation does not throw error for keyLocationMax", () => {
    const max = constants.keyLocationMax;
    const error = `"${max}" is not a valid keyLocation`;
    expect(() => checkKeyLocation(max)).not.toThrow(error);
});

/* Tests: checkValueLocation ------------------------------------------------- */

test("checkValueLocation throws error for undefined", () => {
    const undefinedValue = undefined;
    const error = `"${undefinedValue}" is not a valid valueLocation`;
    expect(() => checkValueLocation(undefinedValue)).toThrow(error);
});

test("checkValueLocation throws error for null", () => {
    const nullValue = null;
    const error = `"${nullValue}" is not a valid valueLocation`;
    expect(() => checkValueLocation(nullValue)).toThrow(error);
});

test("checkValueLocation throws error for a boolean", () => {
    const boolean = true;
    const error = `"${boolean}" is not a valid valueLocation`;
    expect(() => checkValueLocation(boolean)).toThrow(error);
});

test("checkValueLocation throws error for an invalid string", () => {
    const invalidString = "string";
    const error = `"${invalidString}" is not a valid valueLocation`;
    expect(() => checkValueLocation(invalidString)).toThrow(error);
});

test("checkValueLocation does not throw error for valueLocationStart", () => {
    const start = constants.valueLocationStart;
    const error = `"${start}" is not a valid valueLocation`;
    expect(() => checkValueLocation(start)).not.toThrow(error);
});

test("checkValueLocation does not throw error for valueLocationEnd", () => {
    const end = constants.valueLocationEnd;
    const error = `"${end}" is not a valid valueLocation`;
    expect(() => checkValueLocation(end)).not.toThrow(error);
});
