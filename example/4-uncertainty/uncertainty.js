/*** Example animated charts ----------------------------------------------- */

/* Datasets ----------------------------------------------------------------

These datasets are defined explicitly to provide a readable example. In
practice you could either load them from data files or generate them more
tersely using array functions.
---------------------------------------------------------------------------- */

const dataset = [
    {"key": "1", "value": 70.0, "std": 50.0},
    {"key": "2", "value": 60.0, "std": 50.0},
    {"key": "3", "value": 50.0, "std": 50.0},
    {"key": "4", "value": 40.0, "std": 50.0},
    {"key": "5", "value": 30.0, "std": 50.0},
    {"key": "6", "value": 20.0, "std": 50.0},
    {"key": "7", "value": 10.0, "std": 50.0},
    {"key": "8", "value": 1.0, "std": 50.0},
    {"key": "9", "value": -10.0, "std": 50.0},
    {"key": "10", "value": -20.0, "std": 50.0},
    {"key": "11", "value": -30.0, "std": 50.0},
    {"key": "12", "value": -40.0, "std": 50.0},
    {"key": "13", "value": -50.0, "std": 50.0},
    {"key": "14", "value": -60.0, "std": 50.0},
    {"key": "15", "value": -70.0, "std": 50.0}];

/* Constants --------------------------------------------------------------- */

const COLOR_INACTIVE_POS = "#6f9cc6";
const COLOR_INACTIVE_NEG = "#c66fb0";
const COLOR_ACTIVE_POS = "#b0dafd";
const COLOR_ACTIVE_NEG = "#fdb0e7";

/* Function for generating normal random variables ------------------------- */

const normal = (() => {

    /*
    Return a normal random variable with the given mean and standard deviation.
    The function generates a pair of normal random variables using the polar
    method and stores the spare variable in a closure for the next call.
    */

    let spare;
    let hasSpare = false;

    return (mean, std) => {

        let x, y, s, m;

        if (hasSpare) {

            hasSpare = false;
            return mean + std * spare;

        } else {

            do {
                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;
                s = x * x + y * y;
            } while (s >= 1 || s == 0);

            m = Math.sqrt(-2.0 * Math.log(s) / s);
            spare = y * m;
            hasSpare = true;
            return mean + std * x * m;
        }
    };
})();

/* Generator --------------------------------------------------------------- */

function* randomDataGenerator() {
    while (true) {
        const nextData = [];
        dataset.forEach(d => {
            nextData.push({
                key: d.key,
                value: normal(d.value, d.std),
                posRgb: COLOR_ACTIVE_POS,
                negRgb: COLOR_ACTIVE_NEG
            });
        });
        yield nextData;
    }
}

/* Uncertainty chart ------------------------------------------------------- */

const config = {
    element: "example-uncertainty-chart",
    margins: {
        top: 20
    },
    colors: {
        posRgb: COLOR_INACTIVE_POS,
        negRgb: COLOR_INACTIVE_NEG
    },
    valueMin: -200,
    valueMax: 200
};

const chart = new animatedBars.AnimatedColumnChart(dataset, config);
chart.create();

// Add event handler to start on click
chart.selections.svg.on("click", () => {
    if (chart.running) {
        chart.stop();
        chart.update(dataset);
    } else {
        chart.run(randomDataGenerator());
    }
});
