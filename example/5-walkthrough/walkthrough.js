/*** Example animated charts ----------------------------------------------- */

// The data object is an array of key/value pairs
const data = [
    {key: "A", value: -30},
    {key: "B", value: -20},
    {key: "C", value: -10},
    {key: "D", value: 10},
    {key: "E", value: 20},
    {key: "F", value: 30}];

// Settings in the config object will override the defaults
const config = {
    element: "example-column-chart",
    dimensions: {
        width: 700,
        height: 500
    },
    valueMin: -40,
    valueMax: 40
};

// Instantiate the chart object
const chart = new animatedBars.AnimatedColumnChart(data, config);

// Call the chart's create method to create it in the DOM
chart.create();

// New data must use the same keys as the initial data
const newData = [
    {key: "A", value: 30},
    {key: "B", value: 20},
    {key: "C", value: 10},
    {key: "D", value: -5},
    {key: "E", value: -10},
    {key: "F", value: -15}];

// Trigger the update on click using the svg selection
chart.selections.svg.on("click", () => chart.update(newData));

// Define a generator that yields random values for this chart
function* randomGenerator() {
    const keys = ["A", "B", "C", "D", "E", "F"];
    while (true) {
        const nextData = keys.map(d => {
            return {key: d, value: Math.random() * 80 - 40};
        });
        yield nextData;
    }
}

// Call the chart's run method with the generator on click
chart.selections.svg.on("click", () => chart.run(randomGenerator()));

// Start and stop the generator on click
chart.selections.svg.on("click", () => {
    if (chart.running) {
        chart.stop();
        chart.update(data);
    } else {
        chart.run(randomGenerator());
    }
});

// Use a selection to rotate the keyAxis labels
chart.selections.keyAxisGroup
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -10)
    .attr("dy", ".35em")
    .attr("transform", "rotate(270)")
    .style("text-anchor", "end");
