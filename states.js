/* ---------------------------- 
INITIALIZE SCALES, SIZES, MARGINS 
------------------------------ */

var div1 = d3.select('#states').node().getBoundingClientRect();

var margin = { top: 10, bottom: 10, left: 250, right: 40};

var width1 = div1.width - margin.left - margin.right,
	height1 = div1.height - margin.top - margin.bottom,
	innerPadding = 40;

//X axis scale
var xScale1 = d3.scale.linear()
               .range([0, width1 - innerPadding]);

//Y axis scale
var yScale1 = d3.scale.ordinal()
               .rangeRoundBands([0, height1 - innerPadding], .1, .1);

var numTicks = 5;

var xAxis1 = d3.svg.axis()
		.scale(xScale1)
		.orient('bottom')
		.tickSize(-height1)
		.ticks(numTicks);

var yAxis1 = d3.svg.axis()
		.scale(yScale1)
		.orient('left')
		.tickFormat(function (d) { return ''; });

//Append main svg
var svg1 = d3.select('#states')
		.append('svg')
		.attr('width', "100%")
		.attr('height', "100%")
		.attr('viewBox','0 0 '+ width1 + ' ' + height1)
	    .attr('preserveAspectRatio','xMinYMin')
		.attr('class', 'main-svg')
		//.call(responsive)

var barGroup1 = svg1.append('g')
				.attr('transform', 'translate(50,' + margin.top + ')')
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
			.attr('height', yScale1.rangeBand())
			.attr('x', xScale1(0))
			.attr('y', function (d) { return yScale1(d.key); });

	//Numbers at the end of bars
	group.append('text')
		.attr('x', function (d) { return xScale1(d.values.length); })
		.attr('y', function (d) { return yScale1(d.key); })
		.attr('class', 'state-text')
		.text(function (d) { return d.values.length; })
		.attr('text-anchor', 'end')
		.attr("dy", "1.2em")
    .attr("dx", "-.8em")
    .attr("fill", "white");

   group.append("text")
   .attr("x", function(d, i) {
   	if (i === 0) {
   		return xScale1(d.values.length) - 200;
   	}
   	return xScale1(d.values.length) + 20;
   })
   .attr('y', function (d) { return yScale1(d.key); })
   .attr('class', 'state-name')
   .attr("dy", "1.3em")
   .attr("dx", "-.8em")
   .text(function(d){ return d.key; })
   .attr("text-anchor", "start");

    y1.call(yAxis1);
}