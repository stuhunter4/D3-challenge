// set up our chart
var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height",svgHeight);

// append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translage(${margin.left}, ${margin.top})`);

// initial params
//var chosenXAxis = "poverty";
//var chosenYAxis = "healthcare";

// function used for unpdating x-scale var upon click on axis label

// function used for undating xAxis var upon click on axis label

// function used for unpdating y-scale var upon click on axis label

// function used for undating yAxis var upon click on axis label

// function used for updating circles group with a transition to new circles

// function used for updating circles group with new tooltip

// retrieve/import data from the CSV file
d3.csv("../data/data.csv").then(function(censusData) {
    // create a function to parse the data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    // create the scales 
    var xLinearScale = d3.scaleLinear(
        .domain([])
    )
}).catch(function(error) {
    console.log(error);
});