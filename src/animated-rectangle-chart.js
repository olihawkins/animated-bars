/* Animated rectangle chart ------------------------------------------------ */

/* Imports ----------------------------------------------------------------- */

import invariant from "tiny-invariant";

import {
    checkNegativeNumber,
    checkPositiveNumber,
    checkKeyLocation,
    checkValueLocation,
    hasOwnProperty
} from "./utils.js";

import { d3 } from "./d3-sub.js";

/* Class ------------------------------------------------------------------- */

class AnimatedRectangleChart {

    constructor(data, conf = {}) {

        // Create defaults and config: parsing sets missing values to defaults
        const defaults = this.getDefaults();
        const config = this.parseConfig(conf, defaults);

        // Set up created
        this.created = false;

        // Set up defaults and config
        this.defaults = defaults;
        this.config = config;

        // Set up data
        this.setupData = data;

        // Set up selections
        this.selections = {};
        this.selections.svg = null;
        this.selections.dataGroup = null;
        this.selections.keyAxisGroup = null;
        this.selections.valueAxisGroup = null;

        // Set up chart properties
        this.element = config.element;
        this.dimensions = config.dimensions;
        this.margins = config.margins;

        this.width =
            config.dimensions.width -
            config.margins.left -
            config.margins.right;

        this.height =
            config.dimensions.height -
            config.margins.top -
            config.margins.bottom;

        this.colors = config.colors;
        this.keyLocation = config.keyLocation;
        this.keyTitle = config.keyTitle;
        this.keyTitleOffset = config.keyTitleOffset;
        this.keyTickSizeInner = config.keyTickSizeInner;
        this.keyTickSizeOuter = config.keyTickSizeOuter;
        this.valueLocation = config.valueLocation;
        this.valueTitle = config.valueTitle;
        this.valueTitleOffset = config.valueTitleOffset;
        this.valueMin = config.valueMin;
        this.valueMax = config.valueMax;
        this.valueTicks = config.valueTicks;
        this.valueTickSizeInner = config.valueTickSizeInner;
        this.valueTickSizeOuter = config.valueTickSizeOuter;
        this.valueFormat = config.valueFormat;
        this.valuePaddingInner = config.valuePaddingInner;
        this.valuePaddingOuter = config.valuePaddingOuter;
        this.transitionTime = config.transitionTime;
        this.pauseTime = config.pauseTime;

        // Set up animation control
        this.animationTimeout;
        this.callbackTimeout;
        this.running = false;
    }

    /* Public API ---------------------------------------------------------- */

    create() {
        // No-op: implemented by subclasses
    }

    update() {
        // No-op: implemented by subclasses
    }

    run(generator, callback = () => {}, callbackDelay = 0) {

        // step is called recursively until the generator returns done
        const step = () => {

            const {value, done} = generator.next();

            if (! done) {

                const nextData = value;
                const maxDelay = this.getMaxDelay(nextData);
                this.update(nextData);

                // Set animation timeout
                let animationTime =
                    this.transitionTime +
                    this.pauseTime +
                    maxDelay;

                this.animationTimeout = window.setTimeout(
                    () => step(), animationTime);

                let callbackTime = (callbackTime < 0) ? 0 : callbackDelay;

                this.callbackTimeout = window.setTimeout(
                    () => callback(), callbackTime);

            } else {

                this.running = false;
            }
        };

        // If chart not created do nothing and warn
        if (! this.created) {
            console.warn("Chart has not been created");
            return;
        }

        // If chart already running do nothing and warn
        if (this.running) {
            console.warn("Chart animation is already running");
            return;
        }

        // Start recursion
        this.running = true;
        step();
    }

    stop() {

        // If chart not created do nothing and warn
        if (! this.created) {
            console.warn("Chart has not been created");
            return;
        }

        window.clearTimeout(this.animationTimeout);
        this.running = false;
    }

    removeKeyAxisTicks(tickNums, options = {lines: true, labels: true}) {
        this.removeAxisTicks(
            this.selections.keyAxisGroup,
            tickNums,
            options,
            false);
    }

    removeValueAxisTicks(tickNums, options = {lines: true, labels: true}) {
        this.removeAxisTicks(
            this.selections.valueAxisGroup,
            tickNums,
            options,
            false);
    }

    keepKeyAxisTicks(tickNums, options = {lines: true, labels: true}) {
        this.removeAxisTicks(
            this.selections.keyAxisGroup,
            tickNums,
            options,
            true);
    }

    keepValueAxisTicks(tickNums, options = {lines: true, labels: true}) {
        this.removeAxisTicks(
            this.selections.valueAxisGroup,
            tickNums,
            options,
            true);
    }

    /* Internal methods ---------------------------------------------------- */

    getDefaults() {
        return {
            element: "chart",
            dimensions: {
                width: 800,
                height: 450
            },
            margins: {
                top: 80,
                right: 80,
                bottom: 80,
                left: 80
            },
            colors: {
                posRgb: "#55bbee",
                negRgb: "#ee5599"
            },
            keyLocation: "min",
            keyTitle: "Key title",
            keyTitleOffset: 50,
            keyTickSizeInner: 6,
            keyTickSizeOuter: 6,
            valueLocation: "start",
            valueTitle: "Value title",
            valueTitleOffset: 50,
            valueMin: -100,
            valueMax: 100,
            valueTicks: 5,
            valueTickSizeInner: 6,
            valueTickSizeOuter: 6,
            valueFormat: "",
            valuePaddingInner: 0.1,
            valuePaddingOuter: 0.1,
            transitionTime: 1000,
            pauseTime: 1000
        };
    }

    parseConfig(config, defaults) {

        // Element
        if (! hasOwnProperty(config, "element")) {
            config.element = defaults.element;
        }

        // Dimensions
        if (! hasOwnProperty(config, "dimensions")) {
            config.dimensions = {
                width: defaults.dimensions.width,
                height: defaults.dimensions.height
            };
        }

        // Dimensions: width
        if(! hasOwnProperty(config.dimensions, "width")) {
            config.dimensions.width = defaults.dimensions.width;
        }

        checkPositiveNumber("dimensions.width", config.dimensions.width);

        // Dimensions: height
        if(! hasOwnProperty(config.dimensions, "height")) {
            config.dimensions.height = defaults.dimensions.height;
        }

        checkPositiveNumber("dimensions.height", config.dimensions.height);

        // Margins
        if (! hasOwnProperty(config, "margins")) {
            config.margins = {
                top: defaults.margins.top,
                right: defaults.margins.right,
                bottom: defaults.margins.bottom,
                left: defaults.margins.left
            };
        }

        // Margins: top
        if(! hasOwnProperty(config.margins, "top")) {
            config.margins.top = defaults.margins.top;
        }

        checkPositiveNumber("margins.top", config.margins.top);

        // Margins: right
        if(! hasOwnProperty(config.margins, "right")) {
            config.margins.right = defaults.margins.right;
        }

        checkPositiveNumber("margins.right", config.margins.right);

        // Margins: bottom
        if(! hasOwnProperty(config.margins, "bottom")) {
            config.margins.bottom = defaults.margins.bottom;
        }

        checkPositiveNumber("margins.bottom", config.margins.bottom);

        // Margins: left
        if(! hasOwnProperty(config.margins, "left")) {
            config.margins.left = defaults.margins.left;
        }

        checkPositiveNumber("margins.left", config.margins.left);

        // Colors
        if (! hasOwnProperty(config, "colors")) {
            config.colors = {
                posRgb: defaults.colors.posRgb,
                negRgb: defaults.colors.negRgb
            };
        }

        // Colors: posRgb
        if(! hasOwnProperty(config.colors, "posRgb")) {
            config.colors.posRgb = defaults.colors.posRgb;
        }

        // Colors: negRgb
        if(! hasOwnProperty(config.colors, "negRgb")) {
            config.colors.negRgb = defaults.colors.negRgb;
        }

        // Key location
        if(! hasOwnProperty(config, "keyLocation")) {
            config.keyLocation = defaults.keyLocation;
        }

        checkKeyLocation(config.keyLocation);

        // Key title
        if(! hasOwnProperty(config, "keyTitle")) {
            config.keyTitle = defaults.keyTitle;
        }

        // Key title offset
        if(! hasOwnProperty(config, "keyTitleOffset")) {
            config.keyTitleOffset = defaults.keyTitleOffset;
        }

        checkPositiveNumber("keyTitleOffset", config.keyTitleOffset);

        // Key tick size inner
        if(! hasOwnProperty(config, "keyTickSizeInner")) {
            config.keyTickSizeInner = defaults.keyTickSizeInner;
        }

        checkPositiveNumber("keyTickSizeInner", config.keyTickSizeInner);

        // Key tick size outer
        if(! hasOwnProperty(config, "keyTickSizeOuter")) {
            config.keyTickSizeOuter = defaults.keyTickSizeOuter;
        }

        checkPositiveNumber("keyTickSizeOuter", config.keyTickSizeOuter);

        // Value axis
        if(! hasOwnProperty(config, "valueLocation")) {
            config.valueLocation = defaults.valueLocation;
        }

        checkValueLocation(config.valueLocation);

        // Value title
        if(! hasOwnProperty(config, "valueTitle")) {
            config.valueTitle = defaults.valueTitle;
        }

        // Value title offset
        if(! hasOwnProperty(config, "valueTitleOffset")) {
            config.valueTitleOffset = defaults.valueTitleOffset;
        }

        checkPositiveNumber("valueTitleOffset", config.valueTitleOffset);

        // Value min
        if(! hasOwnProperty(config, "valueMin")) {
            config.valueMin = defaults.valueMin;
        }

        checkNegativeNumber("valueMin", config.valueMin);

        // Value max
        if(! hasOwnProperty(config, "valueMax")) {
            config.valueMax = defaults.valueMax;
        }

        checkPositiveNumber("valueMax", config.valueMax);

        // Value ticks
        if(! hasOwnProperty(config, "valueTicks")) {
            config.valueTicks = defaults.valueTicks;
        }

        checkPositiveNumber("valueTicks", config.valueTicks);

        // Value tick size inner
        if(! hasOwnProperty(config, "valueTickSizeInner")) {
            config.valueTickSizeInner = defaults.valueTickSizeInner;
        }

        checkPositiveNumber("valueTickSizeInner", config.valueTickSizeInner);

        // Value tick size outer
        if(! hasOwnProperty(config, "valueTickSizeOuter")) {
            config.valueTickSizeOuter = defaults.valueTickSizeOuter;
        }

        checkPositiveNumber("valueTickSizeOuter", config.valueTickSizeOuter);

        // Value format
        if(! hasOwnProperty(config, "valueFormat")) {
            config.valueFormat = defaults.valueFormat;
        }

        // Value padding inner
        if(! hasOwnProperty(config, "valuePaddingInner")) {
            config.valuePaddingInner = defaults.valuePaddingInner;
        }

        checkPositiveNumber("valuePaddingInner", config.valuePaddingInner);

        // Value padding outer
        if(! hasOwnProperty(config, "valuePaddingOuter")) {
            config.valuePaddingOuter = defaults.valuePaddingOuter;
        }

        checkPositiveNumber("valuePaddingOuter", config.valuePaddingOuter);

        // Transition time
        if(! hasOwnProperty(config, "transitionTime")) {
            config.transitionTime = defaults.transitionTime;
        }

        checkPositiveNumber("transitionTime", config.transitionTime);

        // Pause time
        if(! hasOwnProperty(config, "pauseTime")) {
            config.pauseTime = defaults.pauseTime;
        }

        checkPositiveNumber("pauseTime", config.pauseTime);

        return config;
    }

    getMaxDelay(data) {
        let maxDelay = 0;
        data.map(d => {
            let delay = d.delay;
            if (! hasOwnProperty(d, "delay")) {
                delay = 0.0;
            }
            invariant(!isNaN(delay) && delay >= 0, "Delay values must be positive numbers");
            maxDelay = delay > maxDelay ? delay : maxDelay;
        });
        return maxDelay;
    }

    getUpdateData(nextData) {

        const setupData = this.setupData;

        invariant(nextData.length == setupData.length, "New data does not have the expected length");

        const updateData = [];

        for (let i = 0, j = setupData.length; i < j; i++) {

            const setupItem = setupData[i];
            const nextItem = nextData[i];

            invariant(
                hasOwnProperty(setupItem, "key") && hasOwnProperty(nextItem, "key"),
                "All data objects must have a key property"
            );

            invariant(
                hasOwnProperty(setupItem, "value") && hasOwnProperty(nextItem, "value"),
                "All data objects must have a value property"
            );

            invariant(nextItem.key == setupItem.key, "New data does not contain the expected keys");

            updateData.push({
                key: setupItem.key,
                lastValue: null,
                nextValue: nextItem.value,
                posRgb: nextItem.posRgb || this.colors.posRgb,
                negRgb: nextItem.negRgb || this.colors.negRgb,
                delay: nextItem.delay || 0.0
            });
        }

        return updateData;
    }

    removeAxisTicks(
        axisGroup,
        tickNums,
        options = {lines: true, labels: true},
        invertSelected = false) {

        // If chart not created do nothing and warn
        if (! this.created) {
            console.warn("Chart has not been created");
            return;
        }

        // Choose test to remove the included or excluded ticks
        const include = (tickNums, index) => {
            return tickNums.includes(index) ? true : false;
        };

        const exclude = (tickNums,index) => {
            return tickNums.includes(index) ? false : true;
        };

        const remove = invertSelected ? exclude : include;

        // Remove labels
        if (! hasOwnProperty(options, "labels") || options.labels === true) {
            const tickLabels = axisGroup.selectAll(".tick text");
            tickLabels.each(function(d, i) {
                if (remove(tickNums, i)) d3.select(this).remove();
            });
        }

        // Remove lines
        if (! hasOwnProperty(options, "lines") || options.labels === true) {
            const tickLines = axisGroup.selectAll(".tick line");
            tickLines.each(function(d, i) {
                if (remove(tickNums, i)) d3.select(this).remove();
            });
        }
    }
}

/* Exports ----------------------------------------------------------------- */

export {
    AnimatedRectangleChart
};
