// set up our chart
var svgWidth = 960;
var svgHeight = 500;

// define the chart's margins as an objectS
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
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
    .attr("height", svgHeight);

// append an svg group, then set its margins
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data from the CSV file
d3.csv("/assets/data/data.csv").then(function(censusData) {
    
    // create a function to parse the data
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    console.log(censusData)

    // create scale functions
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.poverty) + 1])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(censusData, d => d.healthcare) + 2])
        .range([height, 0]);

    // create axis funtions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .classed("stateCircle", true);

    var overlayGroup = chartGroup.selectAll("text")
        .data(censusData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("class", "stateText")
        .text(function(d) {
            return d.abbr;
        });

    // initialize tool tip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return(`<strong>${d.state}</strong><br>In Poverty(%): ${d.poverty}<br>Lacks Healthcare(%): ${d.healthcare}`);
        });
    
    // create tooltip in the chart
    chartGroup.call(toolTip);

    // create event listeners to diplay and hide the tooltip
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

    // create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "aText")
        .text("Lacks Healthcare(%)");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top +30})`)
        .attr("class", "aText")
        .text("In Poverty(%)");

}).catch(function(error) {
    console.log(error);
});