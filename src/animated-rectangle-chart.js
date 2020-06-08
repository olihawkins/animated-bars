/* Animated rectangle chart ------------------------------------------------ */

/* Imports ----------------------------------------------------------------- */

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
        this.background = config.background;
        this.title = config.title,
        this.titleSize = config.titleSize,
        this.titleColor = config.titleColor,
        this.titleOffsetX = config.titleOffsetX,
        this.titleOffsetY = config.titleOffsetY,
        this.subtitle = config.subtitle,
        this.subtitleSize = config.subtitleSize,
        this.subtitleColor = config.subtitleColor,
        this.subtitleOffsetX = config.subtitleOffsetX,
        this.subtitleOffsetY = config.subtitleOffsetY,
        this.keyLocation = config.keyLocation;
        this.keyTitle = config.keyTitle;
        this.keyTitleSize = config.keyTitleSize;
        this.keyTitleColor = config.keyTitleColor;
        this.keyTitleOffset = config.keyTitleOffset;
        this.keyTextSize = config.keyTextSize;
        this.keyTextColor = config.keyTextColor;
        this.keyLineColor = config.keyLineColor;
        this.keyTickSizeInner = config.keyTickSizeInner;
        this.keyTickSizeOuter = config.keyTickSizeOuter;
        this.keyTickPadding = config.keyTickPadding;
        this.valueLocation = config.valueLocation;
        this.valueTitle = config.valueTitle;
        this.valueTitleSize = config.valueTitleSize;
        this.valueTitleColor = config.valueTitleColor;
        this.valueTitleOffset = config.valueTitleOffset;
        this.valueMin = config.valueMin;
        this.valueMax = config.valueMax;
        this.valueTextSize = config.valueTextSize;
        this.valueTextColor = config.valueTextColor;
        this.valueLineColor = config.valueLineColor;
        this.valueTicks = config.valueTicks;
        this.valueTickSizeInner = config.valueTickSizeInner;
        this.valueTickSizeOuter = config.valueTickSizeOuter;
        this.valueTickPadding = config.valueTickPadding;
        this.valueFormat = config.valueFormat;
        this.valuePaddingInner = config.valuePaddingInner;
        this.valuePaddingOuter = config.valuePaddingOuter;
        this.shapeRendering = config.shapeRendering;
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
            background: "",
            title: "",
            titleSize: 22,
            titleColor: "#000000",
            titleOffsetX: 20,
            titleOffsetY: 40,
            subtitle: "",
            subtitleSize: 17,
            subtitleColor: "#000000",
            subtitleOffsetX: 20,
            subtitleOffsetY: 30,
            keyLocation: "min",
            keyTitle: "Key title",
            keyTitleSize: 11,
            keyTitleColor: "#000000",
            keyTitleOffset: 50,
            keyTextSize: 11,
            keyTextColor: "#000000",
            keyLineColor: "#000000",
            keyTickSizeInner: 6,
            keyTickSizeOuter: 6,
            keyTickPadding: 3,
            valueLocation: "start",
            valueTitle: "Value title",
            valueTitleSize: 11,
            valueTitleColor: "#000000",
            valueTitleOffset: 50,
            valueMin: -100,
            valueMax: 100,
            valueTextSize: 11,
            valueTextColor: "#000000",
            valueLineColor: "#000000",
            valueTicks: 5,
            valueTickSizeInner: 6,
            valueTickSizeOuter: 6,
            valueTickPadding: 3,
            valueFormat: "",
            valuePaddingInner: 0.1,
            valuePaddingOuter: 0.1,
            shapeRendering: "auto",
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

        // Background color
        if(! hasOwnProperty(config, "background")) {
            config.background = defaults.background;
        }

        // Title
        if(! hasOwnProperty(config, "title")) {
            config.title = defaults.title;
        }

        // Title size
        if(! hasOwnProperty(config, "titleSize")) {
            config.titleSize = defaults.titleSize;
        }

        // Title color
        if(! hasOwnProperty(config, "titleColor")) {
            config.titleColor = defaults.titleColor;
        }

        // Title offsets
        if(! hasOwnProperty(config, "titleOffsetX")) {
            config.titleOffsetX = defaults.titleOffsetX;
        }

        if(! hasOwnProperty(config, "titleOffsetY")) {
            config.titleOffsetY = defaults.titleOffsetY;
        }

        // Subtitle
        if(! hasOwnProperty(config, "subtitle")) {
            config.subtitle = defaults.subtitle;
        }

        // Subtitle size
        if(! hasOwnProperty(config, "subtitleSize")) {
            config.subtitleSize = defaults.subtitleSize;
        }

        // Subtitle color
        if(! hasOwnProperty(config, "subtitleColor")) {
            config.subtitleColor = defaults.subtitleColor;
        }

        // Subtitle offsets
        if(! hasOwnProperty(config, "subtitleOffsetX")) {
            config.subtitleOffsetX = defaults.subtitleOffsetX;
        }

        if(! hasOwnProperty(config, "subtitleOffsetY")) {
            config.subtitleOffsetY = defaults.subtitleOffsetY;
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

        // Key title size
        if(! hasOwnProperty(config, "keyTitleSize")) {
            config.keyTitleSize = defaults.keyTitleSize;
        }

        // Key title color
        if(! hasOwnProperty(config, "keyTitleColor")) {
            config.keyTitleColor = defaults.keyTitleColor;
        } 

        // Key title offset
        if(! hasOwnProperty(config, "keyTitleOffset")) {
            config.keyTitleOffset = defaults.keyTitleOffset;
        }

        checkPositiveNumber("keyTitleOffset", config.keyTitleOffset);

        // Key text size
        if(! hasOwnProperty(config, "keyTextSize")) {
            config.keyTextSize = defaults.keyTextSize;
        }

        // Key text color
        if(! hasOwnProperty(config, "keyTextColor")) {
            config.keyTextColor = defaults.keyTextColor;
        }

        // Key line color
        if(! hasOwnProperty(config, "keyLineColor")) {
            config.keyLineColor = defaults.keyLineColor;
        } 

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

        // Key tick padding
        if(! hasOwnProperty(config, "keyTickPadding")) {
            config.keyTickPadding = defaults.keyTickPadding;
        }

        checkPositiveNumber("keyTickPadding", config.keyTickPadding);

        // Value axis
        if(! hasOwnProperty(config, "valueLocation")) {
            config.valueLocation = defaults.valueLocation;
        }

        checkValueLocation(config.valueLocation);

        // Value title
        if(! hasOwnProperty(config, "valueTitle")) {
            config.valueTitle = defaults.valueTitle;
        }

        // Value title size
        if(! hasOwnProperty(config, "valueTitleSize")) {
            config.valueTitleSize = defaults.valueTitleSize;
        }        

        // Value title color
        if(! hasOwnProperty(config, "valueTitleColor")) {
            config.valueTitleColor = defaults.valueTitleColor;
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

        // Value text size
        if(! hasOwnProperty(config, "valueTextSize")) {
            config.valueTextSize = defaults.valueTextSize;
        }

        // Value text color
        if(! hasOwnProperty(config, "valueTextColor")) {
            config.valueTextColor = defaults.valueTextColor;
        }

        // Value line color
        if(! hasOwnProperty(config, "valueLineColor")) {
            config.valueLineColor = defaults.valueLineColor;
        } 

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

        // Key tick padding
        if(! hasOwnProperty(config, "valueTickPadding")) {
            config.valueTickPadding = defaults.valueTickPadding;
        }

        checkPositiveNumber("valueTickPadding", config.valueTickPadding);

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

        // Shape rendering
        if(! hasOwnProperty(config, "shapeRendering")) {
            config.shapeRendering = defaults.shapeRendering;
        }

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
            if (isNaN(delay) || delay < 0) {
                throw new Error("Delay values must be positive numbers");
            }
            maxDelay = delay > maxDelay ? delay : maxDelay;
        });
        return maxDelay;
    }

    getUpdateData(nextData) {

        const setupData = this.setupData;

        if (nextData.length != setupData.length) {
            throw new Error("New data does not have the expected length");
        }

        const updateData = [];

        for (let i = 0, j = setupData.length; i < j; i++) {

            const setupItem = setupData[i];
            const nextItem = nextData[i];

            if (! hasOwnProperty(setupItem, "key") ||
                ! hasOwnProperty(nextItem, "key")) {
                throw new Error("All data objects must have a key property");
            }

            if (! hasOwnProperty(setupItem, "value") ||
                ! hasOwnProperty(nextItem, "value")) {
                throw new Error("All data objects must have a value property");
            }

            if (nextItem.key != setupItem.key) {
                throw new Error("New data does not contain the expected keys");
            }

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
