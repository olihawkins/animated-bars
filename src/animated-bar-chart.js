/* Animated bar chart ------------------------------------------------------ */

/* Imports ----------------------------------------------------------------- */

import { AnimatedRectangleChart } from "./animated-rectangle-chart.js";
import { getConstants } from "./constants.js";
import { d3 } from "./d3-sub.js";

/* Constants --------------------------------------------------------------- */

const constants = getConstants();

/* Class ------------------------------------------------------------------- */

class AnimatedBarChart extends AnimatedRectangleChart {

    constructor(data, config = {}) {

        super(data, config);

        this.hello = "hello";

        // Create chart scales
        this.keyScale = d3.scaleBand()
            .domain(this.setupData.map(d => d.key))
            .range([0, this.height])
            .paddingInner(this.valuePaddingInner)
            .paddingOuter(this.valuePaddingOuter);

        this.valueScale = d3.scaleLinear()
            .domain([this.valueMin, this.valueMax])
            .range([0, this.width]);

        // Limit values to those representable within the valueScale domain
        this.valueScaleSafe = (value) => {
            if (value < this.valueMin) {
                console.warn("Value below x-axis domain: set to minimum");
                return this.valueScale(this.valueMin);
            }
            if (value > this.valueMax) {
                console.warn("Value above x-axis domain: set to maximum");
                return this.valueScale(this.valueMax);
            }
            return this.valueScale(value);
        };

        // Convert positions on the valueAxis to values
        this.valueScaleInverse = d3.scaleLinear()
            .domain([0, this.width])
            .range([this.valueMin, this.valueMax]);
    }

    /* Public API ---------------------------------------------------------- */

    // Create the chart inside its html element with initial data
    create() {

        // Get update data using initial data
        const updateData = this.getUpdateData(this.setupData);

        // Create svg
        this.selections.svg = d3.select(`#${this.element}`)
            .append("svg")
            .attr("width",
                this.width +
                this.margins.left +
                this.margins.right)
            .attr("height",
                this.height +
                this.margins.top +
                this.margins.bottom);

        this.selections.dataGroup = this.selections.svg
            .append("g")
            .attr("transform", `translate(
                ${this.margins.left},
                ${this.margins.top})`);

        // Create bars
        this.selections.dataGroup.selectAll(`.${constants.classValue}`)
            .data(updateData)
            .enter()
            .append("rect")
            .attr("shape-rendering", "crispEdges")
            .attr("class", d => {
                const cn = d.nextValue < 0 ?
                    constants.classNeg :
                    constants.classPos;
                return `${constants.classValue} ${cn}`;
            });

        this.selections.dataGroup.selectAll(`.${constants.classPos}`)
            .attr("x", this.valueScale(0))
            .attr("y", d => this.keyScale(d.key))
            .attr("width", d => {
                return this.valueScaleSafe(d.nextValue) - this.valueScale(0);
            })
            .attr("height", this.keyScale.bandwidth())
            .attr("fill", d => d.posRgb);

        this.selections.dataGroup.selectAll(`.${constants.classNeg}`)
            .attr("x", d => this.valueScaleSafe(d.nextValue))
            .attr("y", d => this.keyScale(d.key))
            .attr("width", d => {
                return this.valueScale(0) - this.valueScaleSafe(d.nextValue);
            })
            .attr("height", this.keyScale.bandwidth())
            .attr("fill", d => d.negRgb);

        // Create key axis
        const keyAxis =
            this.keyLocation == constants.keyLocationMax ?
                d3.axisRight() :
                d3.axisLeft();

        keyAxis.scale(this.keyScale)
            .tickSizeInner(this.keyTickSizeInner)
            .tickSizeOuter(this.keyTickSizeOuter);

        // Add key axis
        this.selections.keyAxisGroup = this.selections.dataGroup.append("g")
            .attr("class", constants.classKeyAxis)
            .attr("transform", `translate(
                ${this.getKeyLocationTransform()}, 0)`)
            .call(keyAxis);

        // Add key axis title
        if (this.keyTitle !== "") {
            this.selections.dataGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", this.getKeyTitleTransform())
                .attr("x", 0 - (this.height / 2))
                .attr("class", constants.classKeyTitle)
                .style("text-anchor", "middle")
                .text(this.keyTitle);
        }

        // Create value axis
        const valueAxis =
            this.valueLocation == constants.valueLocationEnd ?
                d3.axisBottom() :
                d3.axisTop();

        valueAxis.scale(this.valueScale)
            .ticks(this.valueTicks)
            .tickSizeInner(this.valueTickSizeInner)
            .tickSizeOuter(this.valueTickSizeOuter)
            .tickFormat(d3.format(this.valueFormat));

        // Add value axis
        this.selections.valueAxisGroup = this.selections.dataGroup.append("g")
            .attr("class", constants.classValueAxis)
            .attr("transform", `translate(0,
                ${this.getValueLocationTransform()})`)
            .call(valueAxis);

        // Add value axis title
        if (this.valueTitle !== "") {
            this.selections.dataGroup.append("text")
                .attr("transform", `translate(
                    ${this.width / 2},
                    ${this.getValueTitleTransform()})`)
                .attr("class", constants.classValueTitle)
                .style("text-anchor", "middle")
                .text(this.valueTitle);
        }

        this.created = true;
    }

    // Update the chart with new data
    update(nextData, transitionTime = this.transitionTime) {

        // If chart not created do nothing and warn
        if (! this.created) {
            console.warn("Chart has not been created");
            return;
        }

        // Return the value of the column at its current position
        const getLastValue = (element) => {

            const box = element.node().getBBox();
            const valueZero = this.valueScaleSafe(0);
            const xDistance = Math.abs(box.x - valueZero);
            const xWidthDistance = Math.abs(box.x + box.width - valueZero);

            if (xDistance > xWidthDistance) {
                return this.valueScaleInverse(box.x);
            } else {
                return this.valueScaleInverse(valueZero + box.width);
            }
        };

        const updateData = this.getUpdateData(nextData);

        this.selections.dataGroup.selectAll(`.${constants.classValue}`)
            .data(updateData)
            .attr("class", function(d) {

                const element = d3.select(this);
                d.lastValue = getLastValue(element);

                let attr = constants.classValue;
                if (d.lastValue >= 0 && d.nextValue >= 0) {
                    attr = `
                        ${constants.classValue}
                        ${constants.classPosToPos}`;
                }
                if (d.lastValue < 0 && d.nextValue < 0) {
                    attr = `
                        ${constants.classValue}
                        ${constants.classNegToNeg}`;
                }
                if (d.lastValue >= 0 && d.nextValue < 0) {
                    attr = `
                        ${constants.classValue}
                        ${constants.classPosToNeg}`;
                }
                if (d.lastValue < 0 && d.nextValue >= 0) {
                    attr = `
                        ${constants.classValue}
                        ${constants.classNegToPos}`;
                }
                return attr;
            });

        this.selections.dataGroup.selectAll(`.${constants.classPosToPos}`)
            .transition()
            .delay(d => d.delay)
            .duration(transitionTime)
            .ease(d3.easeCubic)
            .attr("x", this.valueScale(0))
            .attr("width", d => {
                return this.valueScaleSafe(d.nextValue) - this.valueScale(0);
            })
            .attr("fill", d => d.posRgb);

        this.selections.dataGroup.selectAll(`.${constants.classNegToNeg}`)
            .transition()
            .delay(d => d.delay)
            .duration(transitionTime)
            .ease(d3.easeCubic)
            .attr("x", d => this.valueScaleSafe(d.nextValue))
            .attr("width", d => {
                return this.valueScale(0) - this.valueScaleSafe(d.nextValue);
            })
            .attr("fill", d => d.negRgb);

        this.selections.dataGroup.selectAll(`.${constants.classPosToNeg}`)
            .transition()
            .delay(d => d.delay)
            .duration(d => {
                const pc = (d.lastValue /  (d.lastValue - d.nextValue));
                return transitionTime * pc;
            })
            .ease(d3.easeCubicIn)
            .attr("x", this.valueScale(0))
            .attr("width", 0)
            .attr("fill", d => d.posRgb)
            .transition()
            .duration(d => {
                const pc = (-1 * d.nextValue /  (d.lastValue - d.nextValue));
                return transitionTime * pc;
            })
            .ease(d3.easeCubicOut)
            .attr("x", d => this.valueScaleSafe(d.nextValue))
            .attr("width", d => {
                return this.valueScale(0) - this.valueScaleSafe(d.nextValue);
            })
            .attr("fill", d => d.negRgb);

        this.selections.dataGroup.selectAll(`.${constants.classNegToPos}`)
            .transition()
            .delay(d => d.delay)
            .duration(d => {
                const pc = (-1 * d.lastValue /  (d.nextValue - d.lastValue));
                return transitionTime * pc;
            })
            .ease(d3.easeCubicIn)
            .attr("x", this.valueScale(0))
            .attr("width", 0)
            .attr("fill", d => d.negRgb)
            .transition()
            .duration(d => {
                const pc = (d.nextValue /  (d.nextValue - d.lastValue));
                return transitionTime * pc;
            })
            .ease(d3.easeCubicOut)
            .attr("x", this.valueScale(0))
            .attr("width", d => {
                return this.valueScaleSafe(d.nextValue) - this.valueScale(0);
            })
            .attr("fill", d => d.posRgb);
    }

    /* Internal methods ---------------------------------------------------- */

    getDefaults() {
        const defaults = super.getDefaults();
        defaults.valueLocation = "end";
        return defaults;
    }

    getKeyLocationTransform() {
        switch (this.keyLocation) {
        case constants.keyLocationMin:
            return 0;
        case constants.keyLocationZero:
            return this.valueScale(0);
        case constants.keyLocationMax:
            return this.width;
        default:
            return 0;
        }
    }

    getKeyTitleTransform() {
        switch (this.keyLocation) {
        case constants.keyLocationMin:
            return 0 - this.keyTitleOffset;
        case constants.keyLocationZero:
            return 0 - this.keyTitleOffset;
        case constants.keyLocationMax:
            return this.width + this.keyTitleOffset;
        default:
            return 0 - this.keyTitleOffset;
        }
    }

    getValueLocationTransform() {
        switch (this.valueLocation) {
        case constants.valueLocationStart:
            return 0;
        case constants.valueLocationEnd:
            return this.height;
        default:
            return 0;
        }
    }

    getValueTitleTransform() {
        switch (this.valueLocation) {
        case constants.valueLocationStart:
            return 0 - this.valueTitleOffset;
        case constants.valueLocationEnd:
            return this.height + this.valueTitleOffset;
        default:
            return 0 - this.valueTitleOffset;
        }
    }
}

/* Exports ----------------------------------------------------------------- */

export {
    AnimatedBarChart
};
