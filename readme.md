# animated-bars

__animated-bars__ is a JavaScript library for creating animated bar and column charts in webpages. The library exports two classes, `AnimatedBarChart` and `AnimatedColumnChart`, which differ in the orientation of their bars but which are functionally identical.

Create a chart by providing some data and a configuration object. When you `update` a chart with new data, it animates a transition to the new values given the settings in the configuration. A chart can be `run` so that it steps through a sequence of different values at fixed intervals by providing an ES6 generator that yields new data each time it is called.

The library uses [D3](https://d3js.org) to make the charts, but provides a high level interface so that you can use it on its own. However, the D3 selections used to create and run the chart are exposed in the chart object, so you can easily extend a chart's behaviour using D3 if you wish.

Please note that while the library is functional it is not yet 1.0. Until then, its interfaces may evolve in response to feedback.

## Installation

Install the library with `npm` for transpiling and bundling.

```bash
npm install --save-dev animated-bars
```
Then import the classes you need in your code.

```javascript
import { AnimatedColumnChart } from "animated-bars";
// Define config and data then ...
const chart = new AnimatedColumnChart(data, config);
```

Alternatively, you can use the browser library directly in a webpage. Load `animated-bars.min.js` in a `<script>` tag to make the library available as a global object called `animatedBars`.

```html
<script src="animated-bars.min.js"></script>
<script>
// Define config and data then ...
const chart = new animatedBars.AnimatedColumnChart(data, config);
</script>
```

The browser library can be found in the `dist` directory.

## Core principles

The library aims to provide a simple and flexible interface to easily create and update animated bar and column charts. The interface is organised around some core ideas.

Animated charts are instatiated with two components: some initial __data__ and a __config__.

- __data__ is an array of objects representing data points, each of which must contain a __key__ and a __value__ property. These data point objects can optionally have other properties which specify how the chart should present indiviudal values. New `data` that is used to update a chart must have the same keys as the `data` that was used to create it. See the section on [data](#data) below for full details of data points and their properties.

- __config__ is an object whose properties are used to configure the chart. The `config` object supports a number of properties that govern the chart's behaviour, but you only need to explicitly define properties that differ from the defaults. See [configuration](#configuration) below for full details of the properties that can be set in the `config` object, their default values, and the behaviour they control.

The axes of a chart are described in terms of _keys_ and _values_ rather than _x_ and _y_: there is a __keyAxis__ and a __valueAxis__. This approach allows you to describe the structure of a chart independently of which way its bars are oriented. The same data and configuration will work for both bar and column charts, although different configurations may be more appropriate for one type than the other.

## Example usage

A detailed set of examples showing how to use the library can be found in the `examples` directory. You can see these examples running on the web [here](https://olihawkins.com/2019/09/1). The walkthrough below shows the basic steps needed to [create](#create-a-chart), [update](#update-a-chart), and [animate](#animate-a-chart-with-a-generator) a chart.

### Create a chart

Let's create a simple animated column chart. The following example assumes you are working with `npm` but can be quickly adapted to work in the browser by following the slightly different setup instructions shown above. A version of this code using the browser library can be found in the `examples/walkthrough` directory.

Create a `<div>` element for the chart in your html.

```html
<div id="example-column-chart"></div>
```

Import the chart you need from the package (or load the browser library in a `<script>` tag), define or load some data, then define a config for the chart. The `element` property of the `config` identifies the id of the target element in your html.

```javascript
import { AnimatedColumnChart } from "animated-bars";

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
const chart = new AnimatedColumnChart(data, config);

// Call the chart's create method to render it in the DOM
chart.create();
```

### Update a chart

Let's update the chart with new data in response to an event. We can trigger the update when the chart is clicked by calling `update` inside the click handler for the chart's `svg` selection (you can read more about [selections](#selections) below). This is just a simple way to trigger the update for this example: you can update the chart in response to any event by calling `update` with new data.

```javascript
// New data must use the same keys as the initial data
const newData = [
    {key: "A", value: 30},
    {key: "B", value: -20},
    {key: "C", value: 40},
    {key: "D", value: -10},
    {key: "E", value: -25},
    {key: "F", value: 15}];

// Trigger the update on click using the svg selection
chart.selections.svg.on("click", () => chart.update(newData));

```

The chart's bars will transition to the new values over an interval of time that is given by the `transitionTime` in the chart's `config` object. We didn't specify a `transitionTime` in our configuration but the default is one second. You can also set the transition time for an individual transition as an optional second argument to `update`. The transition time is always set in milliseconds.

```javascript
// A five second transition
chart.update(newData, 5000);
```

### Animate a chart with a generator

You can update a chart to show new values at fixed intervals using an ES6 generator. The generator should yield new values for the chart's keys each time it is called. Call a chart's `run` method with a generator to animate the chart through the sequence of values the generator yields. The chart will transition between the values using the `transitionTime` and `pauseTime` values set in the `config`: the pause _follows_ the transition.

Define a generator, then change the click-handler to call the chart's `run` method with the generator.

 ```javascript
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
 ```

You can check if a chart is currently running a generator through its `running` property, and you can stop a chart with its `stop` method. We could update our click handler to start and stop the chart animating random values.

 ```javascript
 chart.selections.svg.on("click", () => {
     if (chart.running) {
         chart.stop();
         chart.update(data);
     } else {
         chart.run(randomGenerator());
     }
 });
 ```

You can find out more about the [methods](#methods) and [properties](#properties) of charts below.

## Constructors

__AnimatedBarChart__(_data_, _config_)
__AnimatedColumnChart__(_data_, _config_)

See the [data](#data) and [configuration](#configuration) sections below for details of the constructor arguments.

## Data

Animated bar and column charts must be instantiated, and can be updated, with a `data` object. This is an array of data point objects, each of which must contain the following properties:

- __key__ - A unique string identifying the data point. The __key__ is used as the label for the data point on the chart's __keyAxis__.

- __value__ - A number representing a value for the data point. This will determine the length of the bar representing the data point on the chart. The __value__ should fall between the lowest and highest values on the __valueAxis__, which are specified by the __valueMin__ and __valueMax__ properties of the `config` object. If the value is below or above this range, the chart will show the __valueMin__ or __valueMax__ respectively for the data point, and a warning will be shown on the console.

The data point items may optionally contain the following properties:

- __posRgb__ A string representing an RGB color value for the color of the bar if the value of the data point is positive e.g. `"#55bbee"`, or `"rgb(85, 187, 283)"`.

- __negRgb__ A string representing an RGB color value for the color of the bar if the value of the data point is negative e.g. `"#ee5599"`, or `"rgb(238, 85, 153)"`.

- __delay__ A number of milliseconds to delay the transition for this data point. By giving different length delays to different data points you can create various visual effects as the chart updates. See the section on [transitions](#transitions) below for further information on the timing of transitions.

If these optional values are not set, __posRgb__ and __negRgb__ default to the equivalent values set in the `config` object, and __delay__ defaults to zero milliseconds.

## Configuration

The default configuration values for both the `AnimatedBarChart` and `AnimatedColumnChart` are shown below.

```javascript
{
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
    valueLocation: // "start" or "end" depending on the class
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

```

There is one property that has a different default value for each class, which is the __valueLocation__ property. For an `AnimatedBarChart` the default is `"end"`, while for an `AnimatedColumnChart` the default is `"start"`.

The properties are:

- __element__ - A string containing the id of the html element within which the SVG of the chart will be created. This should normally be a `<div>`. Note that a leading hash symbol is not necessary.

- __dimensions__ - An object containing __width__ and __height__ properties. These are the dimensions of the SVG for the chart.

- __margins__ - An object containing __top__, __right__, __bottom__ and __left__ properties. These are the widths of the margins for the chart according to the [D3 margin convention](https://bl.ocks.org/mbostock/3019563). Note that the plot area of the chart is equal to the dimensions minus the margins. In other words, the larger the margins, the smaller the plot area. The default values for the margins are large enough to accomodate the tick labels and the axis labels at standard font-sizes, but you may need to increase or reduce them to suit your circumstances.

- __colors__ - An object containing __posRgb__ and __negRgb__ properties. These two properties should contain strings representing RGB color values, such as `"#55bbee"`, or `"rgb(238, 85, 153)"`. __posRgb__ defines the color of bars that show positive values. __negRgb__ defines the color of bars that show negative values. If you want all bars to have the same color irrespective of whether they are positive or negative, set these to the same value.

- __keyLocation__ - A string specifying the location of the __keyAxis__. The __keyLocation__ is defined in relation to the values on the __valueAxis__. Valid locations are:
    - `min` -  The __keyAxis__ is located at the minimun value of the __valueAxis__.
    - `zero` -  The __keyAxis__ is located at the zero value of the __valueAxis__.
    - `max` -  The __keyAxis__ is located at the maximum value of the __valueAxis__.


- __keyTitle__ - A string containing the title for the __keyAxis__. This can be set to `null` if a __keyTitle__ is not needed.

- __keyTitleOffset__ - A number specifying the distance of the __keyTitle__ from the __keyAxis__. The optimum distance will depend on font-sizes, tick labels, margins etc.

- __keyTickSizeInner__ - A number specifying the length of the tick lines associated with the tick labels on the __keyAxis__.

- __keyTickSizeOuter__ A number specifying the length of the tick lines at either end of the __keyAxis__. Setting this to zero removes the tick lines that bookend the __keyAxis__.

- __valueLocation__ - A string specifying the location of the __valueAxis__. The __valueLocation__ is defined in relation to the __keyAxis__. Valid locations are:
    - `start` -  The __valueAxis__ is located at the start of the __keyAxis__.
    - `end` -  The __valueAxis__ is located at the end of the __keyAxis__.


- __valueTitle__ - A string containing the title for the __valueAxis__. This can be set to `null` if a __valueTitle__ is not needed.

- __valueTitleOffset__ - A number specifying the distance of the __valueTitle__ from the __valueAxis__. The optimum distance will depend on font-sizes, tick labels, margins etc.

- __valueMin__ - A number specifying the minimum value of the __valueAxis__.

- __valueMax__ - A number specifying the maximum value of the __valueAxis__.

- __valueTicks__ - A number specifying the suggested number of ticks for the __valueAxis__. Note that because the domain of the __valueAxis__ is set explicitly with __valueMin__ and __valueMax__, the exact number of ticks given by this argument may not be honoured exactly. D3 aims for evenly spaced ticks on round, readable values, and the __valueTicks__ argument is treated as a hint towards this end. The desired number of ticks are typically shown if they create intervals that are multiples of 2, 5 or 10 on the __valueAxis__. The animated bar and column charts have methods for removing individual tick lines and labels from both axes, which can help with more advanced tick formatting requirements if __valueTicks__ doesn't give you exactly what you want on its own.

- __valueTickSizeInner__ - A number specifying the length of the tick lines associated with the tick labels on the __valueAxis__.

- __valueTickSizeOuter__ A number specifying the length of the tick lines at either end of the __valueAxis__. Setting this to zero removes the tick lines that bookend the __valueAxis__. Note that there may be _both_ inner and outer ticks at the ends of the __valueAxis__, so to remove _all_ ticks in these positions you may need to set both __valueTickSizeInner__ and __valueTickSizeOuter__ to zero, or use the __removeValueAxisTicks__ method of the chart to selectively remove the inner ticks at the ends of the __valueAxis__. See [methods](#methods) below for further details.

- __valueFormat__ - A string representing a [D3 format specifier](https://github.com/d3/d3-format) for the valueAxis. This allows you to present values on the __valueAxis__ as percentages, currency, using a comma separator for thousands etc.

- __valuePaddingInner__ - A number specifying the size of the padding to insert between the bars in the chart.

- __valuePaddingOuter__ - A number specifying the size of the padding to insert between the bars and the edges of the chart.

- __transitionTime__ - A number specifying the default duration in milliseconds of the transition from one value to the next when a chart is updated with new data. See the section on [transitions](#transitions) for further information on the timing of transitions.

- __pauseTime__ - A number specifying the default duration in milliseconds of the pause between updates to a chart when a chart is run with a generator. See the section on [transitions](#transitions) for more information about the timing of transitions.

## Methods

__create__()

Creates the animated chart as an object in the DOM. The chart is rendered inside the html element with the id specified in `config.element`.

__update__(_nextData_, _transitionTime = config.transitionTime_)

Updates the chart to show the data in `nextData`. `nextData` must be a `data` object with same keys that were contained in the `data` object used to initialise the chart. The `transitionTime` argument specifies the length of the transition in milliseconds. `transitionTime` is an optional argument. If it is not set explicitly in a call to `update` the chart will use the `transitionTime` provided by the `config` when the chart was initialised.

__run__(_generator_, _callback = () => {}_, _callbackDelay = 0_)

Updates the chart with values drawn from the `generator` at fixed intevals. The total interval between updates is equal to the charts `transitionTime`, plus its `pauseTime`, plus the longest delay specified for a data point in the `data` object returned from the generator.

The final value returned by the generator (the value returned when `done` is `true`) is not used to update the chart. In other words, your generator should `yield` data and `return` when there is no more data to yield.

The `run` method can optionally take a `callback` which is called at the start of each update. The default `callback` is an empty function i.e. it does nothing, but you can provide a callback in order to update other parts of your data visualisation in lock-step with updates to the chart.

The `callbackDelay` is an optional argument that specifies a time in milliseconds to delay the callback from the start of each update. This can be used to help visually synchronise changes made by the callback with changes to the animated bars.

__stop__()

Stops the chart updating from a generator.

__removeKeyAxisTicks__(_tickNums_, _options = {lines: true, labels: true}_)
__removeValueAxisTicks__(_tickNums_, _options = {lines: true, labels: true}_)

Removes the specified ticks from the __keyAxis__ or __valueAxis__. `tickNums` is an array of numbers specifying the indexes of the ticks to be removed. The `options` argument is an optional argument that controls which elements of the ticks are removed. By default both the tick lines and the tick labels are removed for the selected ticks, but setting either option to `false` means those elements of the selected ticks are retained. This can be useful if you wish to remove some labels, while leaving all the ticks in place. Note that as these functions work by removing the tick elements from the DOM, they can only be called after the chart is created.

__keepKeyAxisTicks__(_tickNums_, _options = {lines: true, labels: true}_)
__keepValueAxisTicks__(_tickNums_, _options = {lines: true, labels: true}_)

Removes the unspecified ticks from the __keyAxis__ or __valueAxis__. These functions have the same effect as the functions used to remove ticks, but in these functions the `tickNums` argument specifies the ticks to retain, rather than the ticks to remove. These functions are a convenience for when the number of ticks you wish to remove is larger than the number of ticks you wish to retain. Note that as these functions work by removing the tick elements from the DOM, they can only be called after the chart is created.

## Properties

The `AnimatedBarChart` and `AnimatedColumnChart` classes have a set of properities that correspond to each of those in the `config` object. In addition, there are a handful of other properties that may be useful when working with these charts.

- __height__ - The height of the plot area. This is equal to `dimensions.height` - `margins.top` - `margins.bottom`.  

- __width__ - The width of the plot area. This is equal to `dimensions.width` - `margins.left` - `margins.right`.

- __created__ - A boolean indicating whether the chart's `create` method has been called.

- __running__ - A boolean indicating whether the chart's `run` method is in the process of updating the chart from a generator.

- __selections__ - An object containing the D3 selections used to build the chart. See [selections](#selections) below for further information.

## Transitions

When a chart's `update` method is called with new `data`, the chart's bars will begin transitioning to the new values. The duration of the transition is controlled by the `transitionTime`. A default `transitionTime` is set in the chart's `config` but the duration of an individual transition can also be set with an optional second argument to `update`.

The `data` passed to `update` may optionally specify a delay to the start of the transition for each data point. This means that the total amount of time between `update` being called and all consequent transitions completing is equal to the `tranistionTime` plus the longest delay specified for any of the data points.

When a chart is `run` with a generator, `update` is called repeatedly. The timing of the next call to `update` is equal to the `tranistionTime`, plus the longest delay specified for a data point, plus the `pauseTime`.

The `run` method can optionally take a `callback` so that you can trigger changes to other parts of the user interface in lock-step with changes to the chart. This function is called after `callbackDelay`, which specfies the number of millisecods after `update` that the `callback` is called. The default `callbackDelay` is zero.

The chart's `stop` method will cancel the next scheduled `update` but will not interrupt the current transition or cancel a scheduled `callback`. This ensures that `update` and `callback` are called the same number of times if you keep starting and stopping the chart.

The library does not currently support specifying a different `transitionTime` for each data point, only a different `delay`. I can't see a use case for this but would consider implementing it if there is sufficient interest.

## Selections

This library uses D3 to create animated charts. Some of the most important [D3 selections](https://github.com/d3/d3-selection) used to build the charts are exposed in each chart's `selections` property. These selections are:

- __svg__ - The selection that holds a reference to the SVG element containing the chart.

- __dataGroup__ - The selection that holds a reference to the group element for the chart's plotting area i.e. the region of the chart inside the margins.

- __keyAxisGroup__ - The selection that holds a reference to the group element for the __keyAxis__.

- __valueAxisGroup__ - The selection that holds a reference to the group element for the __valueAxis__.

You can use these selections to do further chart customisaton using D3 functions. For example, if you wish to add a line or a label to a chart you can append a path or text element to the __dataGroup__.

One example of additional customisation you may wish to do is more advanced formatting of the axes. For instance, this library does not currently provide an interface for rotating the text of axis tick labels. But you can control the rotation of this text using the D3 selections in the following way.

```javascript
// Use a selection to rotate the keyAxis labels
chart.selections.keyAxisGroup
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -10)
    .attr("dy", ".35em")
    .attr("transform", "rotate(270)")
    .style("text-anchor", "end");
```

To do this kind of additional customisation you may sometimes need to import additional functions from D3 into your script, depending on exactly what you want to do. This is not needed for the tick label rotation shown above.

## Styling

The library adds classes to some chart elements, which you can use to style parts of the chart with CSS. All of the classes are prefixed `ab-` to denote they were added by animated-bars. Classes you can safely target to style different parts of the chart are:

- `.ab-key-axis` - Add styles to the text of the __keyAxis__.

- `.ab-key-title` - Add styles to the text of the __keyAxisTitle__.

- `.ab-value-axis` - Add styles to the text of the __valueAxis__.

- `.ab-value-title` - Add styles to the text of the __valueAxisTitle__.

One style you may wish to apply globally to the chart is to turn off pointer-events for text elements of the SVG. This stops the cursor from turning into an insertion point as you mouse over text within the chart.

```css
text {
    pointer-events: none;
}
```
