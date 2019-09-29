/*** Example animated charts: Update --------------------------------------- */

/* ESLint exemption -------------------------------------------------------- */
/* global d3 */

/* Functions --------------------------------------------------------------- */

function getData(area, data) {
    const newData = [];
    data.forEach((row) => {
        newData.push({
            key: row.year,
            value: row[area]
        });
    });
    return newData;
}

/* Main: load the data and build the chart --------------------------------- */

d3.csv("house-price-change-by-region.csv").then((data) => {

    // Configure chart
    const setupData = getData("england", data);

    const config = {
        element: "example-update-chart",
        dimensions:{
            width: 800,
            height: 450
        },
        margins: {
            top: 40
        },
        colors: {
            posRgb: "#51db8e",
            negRgb: "#286944"
        },
        keyTitle: null,
        valueTitle: "Annual change",
        valueMin: -0.2,
        valueMax: 0.4,
        valueFormat: ",.0%",
        valuePaddingInner: 0.15,
        valuePaddingOuter: 0.225,
        valueTitleOffset: 60,
        transitionTime: 300
    };

    // Create chart
    const chart = new animatedBars.AnimatedColumnChart(setupData, config);
    chart.create();
    chart.keepKeyAxisTicks([3,8,13,18,23,28]);
    window.chart = chart;

    // Add event listener to select box
    const select = document.getElementById("area-select");
    select.addEventListener("change", () => {
        chart.update(getData(select.value, data));
    });
});
