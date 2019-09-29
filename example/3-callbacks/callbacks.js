/*** Example animated charts: Update --------------------------------------- */

/* ESLint exemption -------------------------------------------------------- */
/* global d3 */

/* Functions --------------------------------------------------------------- */

// Generates new data for the chart on each transition
function* populationGenerator(dataset) {
    for (let i = 0; i < dataset.length; i++) {
        yield dataset[i].data;
    }
}

// Updates the year label on each transition
function getCallback(dataset, yearLabel) {
    let i = 1;
    return () => {
        yearLabel.text(dataset[i].year);
        i++;
    };
}

/* Main: load the data and build the chart --------------------------------- */

d3.csv("uk-population-1971-2018.csv").then((data) => {

    const dataset = [];

    data.forEach((row) => {
        const chartData = [];
        for (let key in row) {
            if(key !== "year") {
                chartData.push({key: key, value: +row[key] / 1000});
            }
        }
        dataset.push({
            year: row.year,
            data: chartData
        });
    });

    // Configure chart
    const config = {
        element: "example-callback-chart",
        dimensions:{
            width: 880,
            height: 450
        },
        margins: {
            top: 20
        },
        colors: {
            posRgb: "#387eb0"
        },
        keyTitle: "Age",
        valueTitle: "Thousands of people",
        valueMin: 0,
        valueMax: 1000,
        valueFormat: ",",
        valuePaddingInner: 0,
        valuePaddingOuter: 0,
        valueTitleOffset: 60,
        transitionTime: 500,
        pauseTime: 500
    };

    // Create Generator
    const generator = populationGenerator(dataset);
    const setupData = generator.next().value;

    // Create chart
    const chart = new animatedBars.AnimatedColumnChart(setupData, config);
    chart.create();
    chart.keepKeyAxisTicks([5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80]);

    // Create a label for the year and append it to the dataGroup selection
    const yearLabel = chart.selections.dataGroup.append("text")
        .attr("transform", `translate(10, ${chart.height - 15})`)
        .style("text-anchor", "start")
        .attr("class", "year-label")
        .text("1971");

    // Create callback
    const callback = getCallback(dataset, yearLabel);
    const callbackDelay = 260;

    // Add event handler to start on click
    chart.selections.svg.on("click", () => {
        if (chart.running) {
            chart.stop();
        } else {
            chart.run(generator, callback, callbackDelay);
        }
    });
});
