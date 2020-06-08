/* Animated column chart: Defaults ----------------------------------------- */

/* Constants --------------------------------------------------------------- */

const classPrefix = "ab";

/* Functions --------------------------------------------------------------- */

function getConstants() {
    return {
        keyLocationMin: "min",
        keyLocationMax: "max",
        keyLocationZero: "zero",
        valueLocationStart: "start",
        valueLocationEnd: "end",
        classPrefix: `${classPrefix}`,
        classTitle: `${classPrefix}-title`,
        classSubtitle: `${classPrefix}-subtitle`,
        classValue: `${classPrefix}-value`,
        classPos: `${classPrefix}-pos`,
        classNeg: `${classPrefix}-neg`,
        classPosToPos: `${classPrefix}-pos-pos`,
        classNegToNeg: `${classPrefix}-neg-neg`,
        classPosToNeg: `${classPrefix}-pos-neg`,
        classNegToPos: `${classPrefix}-neg-pos`,
        classKeyAxis: `${classPrefix}-key-axis`,
        classValueAxis: `${classPrefix}-value-axis`,
        classKeyTitle: `${classPrefix}-key-title`,
        classValueTitle: `${classPrefix}-value-title`
    };
}

/* Exports ----------------------------------------------------------------- */

export {
    getConstants
};
