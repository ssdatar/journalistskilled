/* ---------------------------- 
INITIALIZE SCALES, SIZES, MARGINS 
------------------------------ */

var div = d3.select('#killers').node().getBoundingClientRect();

var margin = { top: 10, bottom: 10, left: 250, right: 40};

var width = div.width - margin.left - margin.right,
	height = div.height - margin.top - margin.bottom,
	innerPadding = 40;

//X axis scale
var xScale = d3.scale.linear()
           .range([0, width - innerPadding]);

//Y axis scale
var yScale = d3.scale.ordinal()
            .rangeRoundBands([0, height - innerPadding], .5, .3);

var numTicks = 5;

var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickSize(-height)
		.ticks(numTicks);

var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.tickFormat(function (d) { return ''; });

//Append main svg
var svg = d3.select('#killers')
		.append('svg')
		.attr("width", '100%')
	    .attr("height", '100%')
	    .attr('viewBox','0 0 '+ width + ' ' + height)
	    .attr('preserveAspectRatio','xMinYMin')
		.attr('class', 'master-svg')

var barGroup = svg.append('g')
				.attr('transform', 'translate(50,' + margin.top + ')')
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
			.attr('height', yScale.rangeBand())
			.attr('x', xScale(0))
			.attr('y', function (d) { return yScale(d.key); });

	//Numbers at the end of bars
	group.append('text')
	.attr('x', function (d) { return xScale(d.values.length); })
	.attr('y', function (d) { return yScale(d.key); })
	.attr('class', 'killer-text')
	.text(function (d) { return d.values.length; })
	.attr('text-anchor', 'end')
	.attr("dy", "1em")
    .attr("dx", "-.6em")
    .attr("fill", "white");

    group.append("text")
    .attr("x", function(d, i){
    	if (i === 1) {
    		return xScale(d.values.length) - innerPadding;
    	}
    	return xScale(d.values.length) + 10;
    })
    .attr('y', function (d) { return yScale(d.key); })
    .attr("class", "killer-name")
    .text(function(d){ return d.key; })
    .attr("dy", "1.1em")
    //.attr("dx", "-.6em")
    .attr("text-anchor", function(d, i) {
    	if (i === 1) { return "end"; }
    	return "start";
    })
    .attr("fill", function(d,i) {
    	if (i === 1) {
    		return "white";
    	}
    });


    // x.call(xAxis);
    y.call(yAxis);
}