/* ---------------------------- 
INITIALIZE SCALES, SIZES, MARGINS 
------------------------------ */

var margin = { top: 10, bottom: 10, left: 250, right: 40};
var width = 900 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

//X axis scale
var xScale = d3.scale.linear()
               .range([0, width]);

//Y axis scale
var yScale = d3.scale.ordinal()
               .rangeRoundBands([0, height]);

var numTicks = 5;

var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickSize(-height)
		.ticks(numTicks);

var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left');

//Append main svg
var svg = d3.select('#killers')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height)
		.attr('class', 'master-svg')
		.call(responsive)

var barGroup = svg.append('g')
				.attr('transform', 'translate(200,' + margin.top + ')')
				.attr('class', 'chart-svg');

var x = barGroup.append('g')
		.attr('class', 'x axis');

var y = barGroup.append('g')
		.attr('class', 'y axis');

d3.csv('static/journalists_killed.csv', drawBarChart);



/* ---------------- 
DRAW THE BAR CHART 
---------------- */

function drawBarChart (error, data) {
	if (error) {
		console.error(error);
		throw error;
	}

	// Find number of deaths categorized by reason
	var groupByKill = d3.nest()
				.key(function (d) { return d.alleged_killer; })
				.entries(data);

	//Find the maximum in our data
	var max = d3.max(groupByKill, function (d) {
		return d.values.length;
	});

	xScale.domain([0, max]);
	
	yScale.domain(groupByKill.map( function (d) {
		return d.key;
	}));

	var group = barGroup.append('g')
				.attr('class', 'alleged-killer')
				.selectAll('text')
				.data(groupByKill)
				.enter()
				.append('g');

	// d3.select('.main-svg').append('text')
	// 	.attr('x', margin.left)
	// 	.attr('y', margin.top / 2)
	// 	.attr('text-anchor','start')
	// 	.text(title)
	// 	.attr('class', 'title');

	// group.append('text')
	// 	.attr('x', '0')
	// 	.attr('y', function (d) { return yScale(d.key); })
	// 	.text(function (d) { return d.key; })
	// 	.attr('text-anchor', 'end')
	// 	.attr('dy', '2em')
	// 	.attr('dx', '-.9em');

	//Append rects
	var rects = group.attr('class', 'bars')
					.append('rect')
					.attr('width', 0)
					.transition()
					.attr('width', function (d) { return xScale(d.values.length); })
					.attr('height', height / 10)
					.attr('x', xScale(0))
					.attr('y', function (d) { return yScale(d.key); });

	//Numbers at the end of bars
	group.append('text')
		.attr('x', function (d) { return xScale(d.values.length); })
		.attr('y', function (d) { return yScale(d.key); })
		.attr('class', 'killer-text')
		.text(function (d) { return d.values.length; })
		.attr('text-anchor', 'end')
		.attr("dy", "1.5em")
        .attr("dx", "1.5em");

    // x.call(xAxis);
    y.call(yAxis);
}

/* ---------------------------- 
MAKE CHART RESPONSIVE 
------------------------------ */

//http://jsfiddle.net/shawnbot/BJLe6/

function responsive (svg) {
	var container = d3.select(svg.node().parentNode);
	//console.log(container)

	width = parseInt(d3.select('#killers').style('width'), 10);
	height = parseInt(d3.select('#killers').style('height'), 10);
    
    var aspectRatio = width / height;

    svg.attr("viewBox", "0 0 " + width + " " + height)
            .attr("preserveAspectRatio", "xMinYMid")
            .call(resize);

    d3.select(window).on('resize', resize);

    function resize() {
    	console.log('hello')
    	var targetWidth = parseInt(container.style("width"));
    	//console.log(targetWidth)
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspectRatio));
    }
}