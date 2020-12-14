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
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// initial params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) *0.8,
            d3.max(censusData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;
}

// function used for undating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
}

// function used for unpdating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) *0.8,
            d3.max(censusData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
}

// function used for undating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
}
// function used for updating circles group with a transition to new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
        

    return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
        

    return circlesGroup;
}

// retrieve/import data from the CSV file
d3.csv("/assets/data/data.csv").then(function(censusData) {

    // create a function to parse the data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.obesity = +data.obesity;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    // create y scale function
    var yLinearScale = yScale(censusData, chosenYAxis);

    // create initial axis funtions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        //.classed("y-axis", true)
        .attr("transform", `translate(20, 0)`)
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("class", "stateText")
        .text(function(d) {
            return d.abbr;
        })
        .classed("stateCircle", true);

    // create group for two x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    // create group for two y-axix labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-50, ${height / 2})`);

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var obesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "obesity")
        .classed("inactive", true)
        .text("Obese (%)");

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                // replaces chosenXAxis with value
                chosenXAxis = value;
                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);
                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
                // update circles with new x values
                circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
                // updates tooltips with new info

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                // replaces chosenYAxis with value
                chosenYAxis = value;
                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(censusData, chosenYAxis);
                // updates y axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);
                // update circles with new y values
                circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
                // updates tooltips with new info

                // changes classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });

}).catch(function(error) {
    console.log(error);
});