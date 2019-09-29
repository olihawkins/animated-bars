/*** Example animated charts ----------------------------------------------- */

/* Datasets ----------------------------------------------------------------

These datasets are defined explicitly to provide a readable example. In
practice you could either load them from data files or generate them more
tersely using array functions.
---------------------------------------------------------------------------- */

const zero = [
    {"key": "1", "value": 0.0, "delay": 50},
    {"key": "2", "value": 0.0, "delay": 100},
    {"key": "3", "value": 0.0, "delay": 150},
    {"key": "4", "value": 0.0, "delay": 200},
    {"key": "5", "value": 0.0, "delay": 250},
    {"key": "6", "value": 0.0, "delay": 300},
    {"key": "7", "value": 0.0, "delay": 350},
    {"key": "8", "value": 0.0, "delay": 400},
    {"key": "9", "value": 0.0, "delay": 450},
    {"key": "10", "value": 0.0, "delay": 500},
    {"key": "11", "value": 0.0, "delay": 550},
    {"key": "12", "value": 0.0, "delay": 600},
    {"key": "13", "value": 0.0, "delay": 650},
    {"key": "14", "value": 0.0, "delay": 700},
    {"key": "15", "value": 0.0, "delay": 750}];

const forwardStep = [
    {"key": "1", "value": 70.0, "delay": 50},
    {"key": "2", "value": 60.0, "delay": 100},
    {"key": "3", "value": 50.0, "delay": 150},
    {"key": "4", "value": 40.0, "delay": 200},
    {"key": "5", "value": 30.0, "delay": 250},
    {"key": "6", "value": 20.0, "delay": 300},
    {"key": "7", "value": 10.0, "delay": 350},
    {"key": "8", "value": 1.0, "delay": 400},
    {"key": "9", "value": -10.0, "delay": 450},
    {"key": "10", "value": -20.0, "delay": 500},
    {"key": "11", "value": -30.0, "delay": 550},
    {"key": "12", "value": -40.0, "delay": 600},
    {"key": "13", "value": -50.0, "delay": 650},
    {"key": "14", "value": -60.0, "delay": 700},
    {"key": "15", "value": -70.0, "delay": 750}];

const reverseStep = forwardStep.map(d => {
    // reverses the values in forwardStep for the same keys and delays
    return {key: d.key, value: -1 * d.value, delay: d.delay};
});

/* Generator --------------------------------------------------------------- */

function* exampleGenerator() {
    let reverse = false;
    for (let i = 0; i < 10; i++) {
        if (reverse) {
            reverse = false;
            yield reverseStep;
        } else {
            reverse = true;
            yield forwardStep;
        }
    }
    yield zero;
}

/* Bar chart --------------------------------------------------------------- */

const config = {
    element: "example-bar-generator",
    dimensions: {
        width: 750,
        height: 550
    },
    margins: {
        top: 20
    },
    colors: {
        posRgb: "#34ebd8",
        negRgb: "#ebe834"
    },
    keyLocation: "zero",
    valueMin: -80,
    valueMax: 80,
    valueTicks: 9,
    transitionTime: 500
};

const chart = new animatedBars.AnimatedBarChart(zero, config);
chart.create();
chart.run(exampleGenerator());
