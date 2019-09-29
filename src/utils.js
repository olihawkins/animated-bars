/* Animated column chart: Utilities ---------------------------------------- */

/* Imports ----------------------------------------------------------------- */

import { getConstants } from "./constants.js";

/* Constants --------------------------------------------------------------- */

const constants = getConstants();

/* Function: hasOwnProperty ------------------------------------------------ */

function hasOwnProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

/* Function: checkNumber -------------------------------------------------- */

function checkNumber(property, value) {
    if (isNaN(value) || value === null) {
        throw new Error(`${property} should be a number`);
    }
}

/* Function: checkNegativeNumber ------------------------------------------- */

function checkNegativeNumber(property, value) {
    checkNumber(property, value);
    if (value > 0) {
        throw new Error(`${property} should be a negative number or zero`);
    }
}

/* Function: checkPositiveNumber ------------------------------------------- */

function checkPositiveNumber(property, value) {
    checkNumber(property, value);
    if (value < 0) {
        throw new Error(`${property} should be a positive number`);
    }
}

/* Function: checkKeyLocation ---------------------------------------------- */

function checkKeyLocation(value) {

    const keyLocations = [
        constants.keyLocationMin,
        constants.keyLocationMax,
        constants.keyLocationZero];

    if (! keyLocations.includes(value)) {
        throw new Error(`"${value}" is not a valid keyLocation`);
    }
}

/* Function: checkValueLocation ---------------------------------------------- */

function checkValueLocation(value) {

    const valueLocations = [
        constants.valueLocationStart,
        constants.valueLocationEnd];

    if (! valueLocations.includes(value)) {
        throw new Error(`"${value}" is not a valid valueLocation`);
    }
}

/* Exports ----------------------------------------------------------------- */

export {
    checkNumber,
    checkPositiveNumber,
    checkNegativeNumber,
    checkKeyLocation,
    checkValueLocation,
    hasOwnProperty
};
