/* ---------------------------- 
INITIALIZE SCALES, SIZES, MARGINS 
------------------------------ */

var margin = { top: 10, bottom: 10, left: 250, right: 40};
var width1 = 900 - margin.left - margin.right;
var height1 = 400 - margin.top - margin.bottom;

//X axis scale
var xScale1 = d3.scale.linear()
               .range([0, width1]);

//Y axis scale
var yScale1 = d3.scale.ordinal()
               .rangeRoundBands([0, height1]);

var numTicks = 5;

var xAxis1 = d3.svg.axis()
		.scale(xScale1)
		.orient('bottom')
		.tickSize(-height1)
		.ticks(numTicks);

var yAxis1 = d3.svg.axis()
		.scale(yScale1)
		.orient('left');

//Append main svg
var svg1 = d3.select('#states')
		.append('svg')
		.attr('width', width1 + margin.left + margin.right)
		.attr('height', height1)
		.attr('class', 'main-svg')
		.call(responsive)

var barGroup1 = svg1.append('g')
				.attr('transform', 'translate(200,' + margin.top + ')')
				.attr('class', 'chart-svg');

var x1 = barGroup1.append('g')
		.attr('class', 'x axis');

var y1 = barGroup1.append('g')
		.attr('class', 'y axis');

d3.csv('static/journalists_killed.csv', draw);



/* ---------------- 
DRAW THE BAR CHART 
---------------- */

function draw (error, data) {
	if (error) {
		console.error(error);
		throw error;
	}

	//console.log(data)

	// Find number of deaths in each state
	var groupByStates = d3.nest()
				.key(function (d) { return d.state; })
				.entries(data);

	//Sort descending
	groupByStates.sort(function (a,b) {
		return b.values.length - a.values.length;
	});

	//Find the maximum in our data
	var max = d3.max(groupByStates, function (d) {
		return d.values.length;
	});

	xScale1.domain([0, max]);
	
	yScale1.domain(groupByStates.map( function (d) {
		return d.key;
	}));

	var group = barGroup1.append('g')
				.attr('class', 'states')
				.selectAll('text')
				.data(groupByStates)
				.enter()
				.append('g');

	//Append rects
	var rects = group.attr('class', 'bar')
					.append('rect')
					.attr('width', 0)
					.transition()
					.attr('width', function (d) { return xScale1(d.values.length); })
					.attr('height', height / 20)
					.attr('x', xScale1(0))
					.attr('y', function (d) { return yScale1(d.key); });

	//Numbers at the end of bars
	group.append('text')
		.attr('x', function (d) { return xScale1(d.values.length); })
		.attr('y', function (d) { return yScale1(d.key); })
		.attr('class', 'state-text')
		.text(function (d) { return d.values.length; })
		.attr('text-anchor', 'end')
		.attr("dy", "1em")
        .attr("dx", "1.1em");

    // x1.call(xAxis1);
    y1.call(yAxis1);
}

/* ---------------------------- 
MAKE CHART RESPONSIVE 
------------------------------ */

//http://jsfiddle.net/shawnbot/BJLe6/

function responsive (svg) {
	var container = d3.select(svg.node().parentNode);

	width1 = parseInt(d3.select('#states').style('width'), 10);
	height1 = parseInt(d3.select('#states').style('height'), 10);
    
    var aspectRatio = width1 / height1;

    svg.attr("viewBox", "0 0 " + width1 + " " + height1)
            .attr("preserveAspectRatio", "xMinYMid")
            .call(resize);

    d3.select(window).on('resize', resize);

    function resize() {
    	var targetwidth1 = parseInt(container.style("width"));
        svg.attr("width", targetwidth1);
        svg.attr("height", Math.round(targetwidth1 / aspectRatio));
    }
}